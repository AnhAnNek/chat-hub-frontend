import ConversationHeader from "./ConversationHeader";
import ConversationSearchBar from "./ConversationSearchBar";
import MessageHeader from "./MesageHeader";
import MessageArea from "./MessageArea";
import MessageInputTool from "./MessageInputTool";
import {useEffect, useState} from "react";
import ConversationDetailsSlide from "./ConversationDetailsSlide/ConversationDetailsSlide";
import ConversationList from "./ConversationList";
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import {useAuthentication} from "../../hooks/useAuthentication";
import {ORIGINAL_API_URL} from "../../utils/base";

const AT_LEAST_CHARACTERS = 4;
let stompClient = null;

const ChatPage = () => {
    useAuthentication();

    const curSenderUsername = sessionStorage.getItem("username");

    const [curConversations, setCurConversations] = useState([]);
    const [curSearchedConversations, setCurSearchedConversations] = useState([]);
    const [curConversation, setCurConversation] = useState(null);
    const [displayConversationSpinner, setDisplayConversationSpinner] = useState(true);
    const [curChatMessages, setCurChatMessages] = useState([]);
    const [displayMessageSpinner, setDisplayMessageSpinner] = useState(true);
    const [isDetailConversationOpen, setIsDetailConversationOpen] = useState(false);

    const connect = () => {
        disconnect();
        if (curSenderUsername) {
            console.log("Connect WS");

            const wsUrl = `${ORIGINAL_API_URL}/ws`;
            const socket = new SockJS(wsUrl);
            stompClient = over(socket);

            stompClient.connect({}, onConnected, onError);
        }
    };

    const disconnect = () => {
        if (stompClient !== null) {
            stompClient.disconnect();
        }
        console.log("Disconnected");
    };

    const onConnected = (frame) => {
        console.log('onConnected function: ' + frame);

        if (stompClient && stompClient.connected) {
            subscribeTopics();
            sendUserJoinMessage();
        }
    };

    const subscribeTopics = () => {
        const receivingDest = getReceivingDestination();
        console.log("Receiving destination: " + receivingDest);
        stompClient.subscribe(receivingDest, onMessageReceived);

        const onlineUsersDest = getOnlineUsersDestination();
        console.log("Online users destination: " + onlineUsersDest);
        stompClient.subscribe(onlineUsersDest, onOnlineUsersReceived);
    }

    const onMessageReceived = (payload) => {
        console.log('onMessageReceived function');

        const chatMessage = JSON.parse(payload.body);
        console.log('Received message:', chatMessage);

        addToMessageArea(chatMessage);
    }

    const onOnlineUsersReceived = (payload) => {
        console.log('onOnlineUsersReceived function');
        const onlineUsernames = JSON.parse(payload.body);
        console.log("Online usernames: " + onlineUsernames);

        const newConversations = curConversations.map(item => {
            if (onlineUsernames.includes(item?.name)) {
                return { ...item, isOnline: true };
            } else {
                return { ...item, isOnline: false };
            }
        })
        setCurConversations(newConversations);
    }

    const sendUserJoinMessage = () => {
        const chatMessage = {
            content: `\`${curSenderUsername}\` joined!`,
            type: 'NOTIFICATION',
            sendingTime: new Date().getTime(),
            senderUsername: curSenderUsername,
            conversationId: curConversation?.id
        }
        const addingUserDest = getAddingUserDestination();
        stompClient.send(addingUserDest, {}, JSON.stringify(chatMessage));
    }

    const onError = (error) => {
        console.log(error);
    };

    const getReceivingDestination = () => {
        return `/topic/messages/${curConversation?.id}`;
    }

    const getSendingDestination = () => {
        return `/app/chat.sendMessage`;
    }

    const getAddingUserDestination = () => {
        return `/app/chat.addUser/${curSenderUsername}`;
    }

    const getOnlineUsersDestination = () => {
        return `/topic/online-users`;
    }

    const fetchConversations = async () => {
        setDisplayConversationSpinner(true);
        try {
            const restUrl = `${ORIGINAL_API_URL}/api/conversations/get-conversations?username=${curSenderUsername}`;
            const response = await fetch(restUrl);
            const conversations = await response.json();
            if (conversations?.length > 0) {
                handleConversationItemClick(conversations[0]);
            }
            setCurConversations(conversations);
            setCurSearchedConversations(conversations);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setDisplayConversationSpinner(false);
        }
    };

    const fetchChatMessages = async (conversationId) => {
        setDisplayMessageSpinner(true);
        try {
            const response = await fetch(`${ORIGINAL_API_URL}/api/messages/get-messages?conversationId=${conversationId}`);
            const chatMessages = await response.json();
            setCurChatMessages(chatMessages);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setDisplayMessageSpinner(false);
        }
    };

    const sendToServer = (chatMessage) => {
        if (stompClient) {
            const sendingDest = getSendingDestination();
            stompClient.send(sendingDest, {}, JSON.stringify(chatMessage));
        } else {
            console.log("Missing message");
        }
    };

    const addToMessageArea = (newChatMessage) => {
        setCurChatMessages((prevChatMessages) =>
            [...prevChatMessages, newChatMessage]);
    };

    const onSearch = (searchTerm) => {
        if (searchTerm === undefined || searchTerm === null || searchTerm.length < AT_LEAST_CHARACTERS) {
            setCurSearchedConversations(curConversations);
            return;
        }

        const searchedConversations = curConversations.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCurSearchedConversations(searchedConversations);
    };

    const handleConversationItemClick = (conversation) => {
        console.log(`On click conversation item: ${conversation}`);
        const newConversationId = conversation?.id;
        if (newConversationId === curConversation?.id) {
            return;
        }
        setCurConversation({ ...conversation, isSelected: true });
        console.log(`After setCurConversation: ${curConversation?.id}`);

        const newConversations = curConversations.map(item => {
            if (item.id === newConversationId) {
                return { ...item, isSelected: true };
            } else {
                return { ...item, isSelected: false };
            }
        });
        setCurConversations(newConversations);
    };

    useEffect(() => {
        fetchConversations();
    }, [curSenderUsername]);

    useEffect(() => {
        if (curConversation) {
            fetchChatMessages(curConversation?.id);
            connect();
        }
    }, [curConversation]);

    return (
        <div className="flex flex-wrap">
            <div className="w-full md:w-1/4 bg-gray-100 h-screen flex flex-col">
                <div className="flex-shrink-0 p-5">
                    <ConversationHeader username={curSenderUsername}/>
                    <ConversationSearchBar onSearch={onSearch}/>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <ConversationList
                        conversations={curSearchedConversations}
                        displaySpinner={displayConversationSpinner}
                        handleConversationItemClick={handleConversationItemClick}
                    />
                </div>
            </div>

            <div className="w-full md:w-3/4 p-4 h-screen flex flex-col">
                <div>
                    <MessageHeader
                        conversation={curConversation}
                        onOpenDetailConversation={() => setIsDetailConversationOpen(true)}
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    <MessageArea
                        curSenderUsername={curSenderUsername}
                        chatMessages={curChatMessages}
                        displaySpinner={displayMessageSpinner}
                    />
                </div>
                <div className="shrink-0">
                    <MessageInputTool
                        curUsername={curSenderUsername}
                        curConversationId={curConversation?.id}
                        sendToServer={sendToServer}
                    />
                </div>
            </div>
            <ConversationDetailsSlide
                open={isDetailConversationOpen}
                onClose={() => setIsDetailConversationOpen(false)}
                conversation={curConversation}
            />
        </div>
    );
}

export default ChatPage;