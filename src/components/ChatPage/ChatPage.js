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

    const [isConversationsLoaded, setIsConversationsLoaded] = useState(false);
    const [subscribedConversationDestinations, setSubscribedConversationDestinations] = useState([]);

    const connect = () => {
        console.log("Connect WS");

        const wsUrl = `${ORIGINAL_API_URL}/ws`;
        const socket = new SockJS(wsUrl);
        stompClient = over(socket);

        stompClient.connect({}, onConnected, onError);
    };

    const disconnect = () => {
        if (stompClient && stompClient.connected) {
            stompClient.disconnect(() => {
                console.log("Disconnected");
            });
        } else {
            console.log("No active connection to disconnect");
        }
    };

    const onConnected = (frame) => {
        console.log('WebSocket connection established: ' + frame);

        if (stompClient.connected) {
            subscribeDefaultTopics();
            resubscribeToConversationTopics();
            addUserToServer();
        }
    };

    const subscribeDefaultTopics = () => {
        const onlineUsersDest = getOnlineUsersDestination();
        console.log("Online users destination: " + onlineUsersDest);
        stompClient.subscribe(onlineUsersDest, onOnlineUsersReceived);

        const newConversationDest = getNewConversationDestination();
        console.log("New conversation destination: " + newConversationDest);
        stompClient.subscribe(newConversationDest, onNewConversationReceived);
    }

    const onOnlineUsersReceived = (payload) => {
        console.log('onOnlineUsersReceived function');
        const onlineUsernames = JSON.parse(payload.body);
        console.log("Online usernames: " + onlineUsernames);
        updateOnlineStatus(onlineUsernames);
    };

    const updateOnlineStatus = (onlineUsernames) => {
        const newConversations = curConversations.map(item => {
            if (onlineUsernames.includes(item?.name)) {
                return { ...item, isOnline: true };
            } else {
                return { ...item, isOnline: false };
            }
        });
        setCurConversations(newConversations);
        setCurSearchedConversations(newConversations);
    }

    const onNewConversationReceived = (payload) => {
        console.log('onNewConversationReceived function');
        const conversation = JSON.parse(payload.body);

        const newConversations = curConversations.map(prevConversations => [...prevConversations, conversation]);

        setCurConversations(newConversations);
        setCurSearchedConversations(newConversations);
    }

    const addUserToServer = () => {
        console.log(`Add an user: ${curSenderUsername}`);
        const addingUserDest = getAddingUserDestination();
        stompClient.send(addingUserDest, {}, '');
    };

    const onError = (error) => {
        console.error('WebSocket connection error:', error);
    };

    const resubscribeToConversationTopics = () => {
        const newDestinations = curConversations
            .map((conversation) => getReceivingDestination(conversation.id));

        unsubscribeAllConversationTopics();

        newDestinations.forEach((newDest) => {
            subscribeToConversationTopic(newDest, onMessageReceived);
        });
        console.log("Subscribe to conversation topics");
    };

    const onMessageReceived = (payload) => {
        console.log('onMessageReceived function');

        const chatMessage = JSON.parse(payload.body);
        console.log('Received message: ', chatMessage);

        updateLastMessage(chatMessage);

        if (chatMessage.conversationId === curConversation.id) {
            addToMessageArea(chatMessage);
        }
    };

    const updateLastMessage = (lastMessage) => {
        const lastMessageId = lastMessage.conversationId;
        const updatedConversations = curConversations.map(item => {
            if (item.id === lastMessageId) {
                const updatedItem = { ...item, lastMessageDTO: lastMessage };
                return updatedItem;
            }
            return item;
        });

        const conversationIndex = updatedConversations.findIndex(item => item.id === lastMessageId);
        if (conversationIndex !== -1) {
            const movedConversation = updatedConversations.splice(conversationIndex, 1)[0];
            updatedConversations.unshift(movedConversation);
        }

        setCurConversations(updatedConversations);
        setCurSearchedConversations(updatedConversations);
    };

    const subscribeToConversationTopic = (destination, callback) => {
        const isSubscribed = subscribedConversationDestinations.some(subscribedDestination =>
            subscribedDestination.destination === destination);
        if (!isSubscribed) {
            const subscription = stompClient.subscribe(destination, callback);
            const newDestination = {id: subscription.id, destination: destination};
            setSubscribedConversationDestinations((prevDestinations) =>
                [...prevDestinations, newDestination]);
        }
    };

    const unsubscribeAllConversationTopics = () => {
        subscribedConversationDestinations.forEach((subscribedDest, index) => {
            stompClient.unsubscribe(subscribedDest?.id);
        })
        setSubscribedConversationDestinations([]);
        console.log("Unsubscribed from all topics");
    };

    const getNewConversationDestination = () => {
        return `/topic/newConversation`;
    };

    const getReceivingDestination = (conversationId) => {
        return `/topic/messages/${conversationId}`;
    };

    const getSendingDestination = () => {
        return `/app/chat.sendMessage`;
    };

    const getAddingUserDestination = () => {
        return `/app/chat.addUser/${curSenderUsername}`;
    };

    const getOnlineUsersDestination = () => {
        return `/topic/online-users`;
    };

    const fetchConversations = async () => {
        setDisplayConversationSpinner(true);
        try {
            const restUrl = `${ORIGINAL_API_URL}/api/conversations/get-conversations?username=${curSenderUsername}`;
            const response = await fetch(restUrl);
            const conversations = await response.json();
            const updatedConversations = conversations.map(item =>
                ({...item, isOnline: false, isSelected: false}));

            if (updatedConversations?.length > 0) {
                handleConversationItemClick(updatedConversations[0]);
            }

            setCurConversations(updatedConversations);
            setCurSearchedConversations(updatedConversations);
            setIsConversationsLoaded(true);

            setDisplayConversationSpinner(false);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const fetchChatMessages = async (conversationId) => {
        setDisplayMessageSpinner(true);
        try {
            const restUrl =`${ORIGINAL_API_URL}/api/messages/get-messages?conversationId=${conversationId}`;
            const response = await fetch(restUrl);
            const chatMessages = await response.json();
            setCurChatMessages(chatMessages);
            setDisplayMessageSpinner(false);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const fetchOnlineUsers = async () => {
        try {
            const restUrl = `${ORIGINAL_API_URL}/api/users/get-online-users`;
            const response = await fetch(restUrl);
            const onlineUsernames = await response.json();
            updateOnlineStatus(onlineUsernames);
        } catch (error) {
            console.error("Error fetching conversations:", error);
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
        setCurConversation(conversation);
        console.log(`After setCurConversation: ${curConversation?.id}`);

        updateSelectedItem(newConversationId);
    };

    const updateSelectedItem = (conversationId) => {
        const newConversations = curConversations.map(item => {
            if (item.id === conversationId) {
                return { ...item, isSelected: true };
            }
            return { ...item, isSelected: false };
        });
        setCurConversations(newConversations);
        setCurSearchedConversations(newConversations);
    }

    useEffect(() => {
        if (curSenderUsername) {
            fetchConversations();
        }
    }, []);

    useEffect(() => {
        if (isConversationsLoaded && curSenderUsername) {
            connect();
            fetchOnlineUsers();
        }

        return () => {
            disconnect();
        };
    }, [curSenderUsername, isConversationsLoaded]);

    useEffect(() => {
        if (curConversation) {
            fetchChatMessages(curConversation?.id);
        }
    }, [curConversation]);

    return (
        <div className="flex flex-wrap">
            <div className="w-full md:w-1/4 bg-gray-100 h-screen flex flex-col">
                <div className="flex-shrink-0 p-5">
                    <ConversationHeader
                        username={curSenderUsername}
                        onDisconnect={disconnect}
                    />
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