import ConversationHeader from "./ConversationHeader";
import ConversationSearchBar from "./ConversationSearchBar";
import MessageHeader from "./MesageHeader";
import MessageArea from "./MessageArea";
import MessageInputTool from "./MessageInputTool";
import {useEffect, useRef, useState} from "react";
import ConversationDetailsSlide from "./ConversationDetailsSlide/ConversationDetailsSlide";
import ConversationList from "./ConversationList";
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import {useAuthentication} from "../../hooks/useAuthentication";

let stompClient = null;

const ChatPage = () => {
    useAuthentication();

    const ORIGINAL_URL = 'http://localhost:8000';

    const curSenderUsername = sessionStorage.getItem("username");

    const [curConversations, setCurConversations] = useState([]);
    const [curSearchedConversations, setCurSearchedConversations] = useState([]);
    const [curConversation, setCurConversation] = useState(null);
    const [displayConversationSpinner, setDisplayConversationSpinner] = useState(true);
    const [curChatMessages, setCurChatMessages] = useState([]);
    const [displayMessageSpinner, setDisplayMessageSpinner] = useState(true);
    const [isDetailConversationOpen, setIsDetailConversationOpen] = useState(false);

    const messageAreaRef = useRef(null);

    const connect = () => {
        disconnect();
        if (curSenderUsername) {
            console.log("Connect WS");

            const wsUrl = `${ORIGINAL_URL}/ws`;
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

        subscribeTopics();
        sendUserJoinMessage();
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
        // fetchConversations(onlineUsernames);
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
            const restUrl = `${ORIGINAL_URL}/api/conversations/get-conversations?username=${curSenderUsername}`;
            const response = await fetch(restUrl);
            const conversations = await response.json();
            console.log(conversations);
            if (conversations.length > 0) {
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
            const response = await fetch(`${ORIGINAL_URL}/api/messages/get-messages?conversationId=${conversationId}`);
            const chatMessages = await response.json();
            console.log(chatMessages);
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
        }
    };

    const addToMessageArea = (newChatMessage) => {
        setCurChatMessages((prevChatMessages) =>
            [...prevChatMessages, newChatMessage]);

        messageAreaRef.current.handleScrollDown();
    };

    const onSearch = (searchTerm) => {
        const AT_LEAST_CHARACTERS = 4;
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
        if (conversation?.id === curConversation?.id) {
            return;
        }
        setCurConversation(conversation);
        console.log(`After setCurConversation: ${curConversation?.id}`);
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
            <div className="w-full md:w-1/4 bg-gray-100 p-5 h-screen flex flex-col">
                <div className="flex-shrink-0">
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
                        parentRef={messageAreaRef}
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