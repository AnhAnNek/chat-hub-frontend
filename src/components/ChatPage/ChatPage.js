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
import {ORIGINAL_API_URL} from "../../utils/base";
import ConversationService from "../../api/conversationService";
import MessageService from "../../api/messageService";
import UserService from "../../api/userService";
import {useAuth} from "../../contexts/AuthContext";

const AT_LEAST_CHARACTERS = 4;
let stompClient = null;

const ChatPage = () => {

    const ChangeTypes = {
        UNCHANGED: 'UNCHANGED',
        INITIALIZED: 'INITIALIZED',
        ADD_ITEM_TO_TOP: 'ADD_ITEM_TO_TOP',
        DELETED: 'DELETED',
        MOVE_ITEM_TO_TOP: 'MOVE_ITEM_TO_TOP',
        UPDATE_MEMBER_STATUS: 'UPDATE_MEMBER_STATUS'
    }

    const { auth } = useAuth();

    const [curConversations, setCurConversations] = useState([]);
    const [typeChangeOfConversations, setTypeChangeOfConversations] = useState(ChangeTypes.UNCHANGED);
    const [displayConversationSpinner, setDisplayConversationSpinner] = useState(true);
    const [subscribedConversationDestinations, setSubscribedConversationDestinations] = useState([]);
    // const [curSearchedConversations, setCurSearchedConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [curChatMessages, setCurChatMessages] = useState([]);
    const [displayMessageSpinner, setDisplayMessageSpinner] = useState(true);
    const [isDetailConversationOpen, setIsDetailConversationOpen] = useState(false);

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
        setTypeChangeOfConversations(ChangeTypes.UPDATE_MEMBER_STATUS);
    }

    const onNewConversationReceived = (payload) => {
        console.log('onNewConversationReceived function');
        const conversation = JSON.parse(payload.body);

        const newConversations = curConversations.map(prevConversations => [...prevConversations, conversation]);

        setCurConversations(newConversations);
        setTypeChangeOfConversations(ChangeTypes.ADD_ITEM_TO_TOP);
    }

    const addUserToServer = () => {
        console.log(`Add an user: ${auth.username}`);
        const addingUserDest = getAddingUserDestination();
        stompClient.send(addingUserDest, {}, '');
    };

    const onError = (error) => {
        console.error('WebSocket connection error:', error);
    };

    const resubscribeToConversationTopics = () => {
        const newDestinations = curConversations
            .map((conversation) => getReceivingDestination(conversation.id));

        // unsubscribeAllConversationTopics();

        newDestinations.forEach((newDest) => {
            subscribeToConversationTopic(newDest, onMessageReceived);
        });
        console.log("Subscribe to conversation topics");
    };

    const onMessageReceived = (payload) => {
        console.log('onMessageReceived function');

        const chatMessage = JSON.parse(payload.body);
        console.log('Received message: ', chatMessage);

        if (chatMessage.conversationId === selectedConversation?.id) {
            addToMessageArea(chatMessage);
        }

        updateLastMessage(chatMessage);
    };

    const updateLastMessage = (lastMessage) => {
        const lastMessageId = lastMessage.conversationId;

        const updatedConversations = [ ...curConversations ];

        const conversationIndex = updatedConversations.findIndex(item => item.id === lastMessageId);
        if (conversationIndex !== -1) {
            const movedConversation = { ...updatedConversations[conversationIndex], lastMessageDTO: lastMessage };
            updatedConversations.splice(conversationIndex, 1)
            updatedConversations.unshift(movedConversation);
        }

        setCurConversations(updatedConversations);
        setTypeChangeOfConversations(ChangeTypes.UPDATE_MEMBER_STATUS);
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
        return `/app/chat.addUser/${auth.username}`;
    };

    const getOnlineUsersDestination = () => {
        return `/topic/online-users`;
    };

    const fetchConversations = async () => {
        setDisplayConversationSpinner(true);
        try {
            const conversations = await ConversationService.getConversations(auth.accessToken, auth.username);
            const updatedConversations = conversations.map(item =>
                ({...item, isOnline: false, isSelected: false}));

            setCurConversations(updatedConversations);
            setTypeChangeOfConversations(ChangeTypes.INITIALIZED);

            setDisplayConversationSpinner(false);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            setDisplayConversationSpinner(true);
        }
    };

    const fetchChatMessages = async (conversationId) => {
        setDisplayMessageSpinner(true);
        try {
            const chatMessages = await MessageService.getMessages(auth.accessToken, conversationId);
            setCurChatMessages(chatMessages);
            setDisplayMessageSpinner(false);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            setDisplayMessageSpinner(true);
        }
    };

    const fetchOnlineUsers = async () => {
        try {
            const onlineUsernames = await UserService.getOnlineUsers(auth.accessToken);
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
            // setCurSearchedConversations(curConversations);
            return;
        }

        const searchedConversations = curConversations.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        // setCurSearchedConversations(searchedConversations);
    };

    const onClickConversationItem = async (conversation) => {
        console.log(`On click conversation item: ${conversation}`);
        const newConversationId = conversation?.id;
        if (newConversationId === selectedConversation?.id) {
            return;
        }
        const updatedConversation = await updateSelectedItem(newConversationId);
        setSelectedConversation(JSON.parse(JSON.stringify(updatedConversation)));
    };

    const updateSelectedItem = (conversationId) => {
        const updatedConversations = curConversations.map(item => {
            if (item.id === conversationId) {
                return { ...item, isSelected: true };
            }
            return { ...item, isSelected: false };
        });
        setCurConversations(updatedConversations);
        setTypeChangeOfConversations(ChangeTypes.UPDATE_MEMBER_STATUS);

        return updatedConversations.find(item => item.isSelected);
    }

    useEffect( () => {
        if (auth.username) {
            fetchConversations();
        }
    }, [auth]);

    const initConnection = () => {
        if (auth.username) {
            connect();
            fetchOnlineUsers();
        }

        return () => {
            disconnect();
        };
    }

    useEffect(() => {
        // setCurSearchedConversations(curConversations);

        switch (typeChangeOfConversations) {
            case ChangeTypes.INITIALIZED:
                initConnection();

                if (curConversations?.length > 0) {
                    const firstItem = curConversations[0];
                    onClickConversationItem(firstItem);
                }
                break;
            case ChangeTypes.ADD_ITEM_TO_TOP:
                break;
            case ChangeTypes.DELETED:
                break;
            case ChangeTypes.MOVE_ITEM_TO_TOP:
                break;
            case ChangeTypes.UPDATE_MEMBER_STATUS:
                break;
        }

        setTypeChangeOfConversations(ChangeTypes.UNCHANGED);
    }, [curConversations]);

    useEffect(() => {
        if (selectedConversation) {
            fetchChatMessages(selectedConversation?.id);
        }
    }, [selectedConversation]);

    return (
        <div className="flex flex-wrap">
            <div className="w-full md:w-1/4 bg-gray-100 h-screen flex flex-col">
                <div className="flex-shrink-0 p-5">
                    <ConversationHeader
                        username={auth.username}
                        onDisconnect={disconnect}
                    />
                    <ConversationSearchBar onSearch={onSearch}/>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <ConversationList
                        conversations={curConversations}
                        displaySpinner={displayConversationSpinner}
                        handleConversationItemClick={onClickConversationItem}
                    />
                </div>
            </div>

            <div className="w-full md:w-3/4 p-4 h-screen flex flex-col">
                <div>
                    <MessageHeader
                        conversation={selectedConversation}
                        onOpenDetailConversation={() => setIsDetailConversationOpen(true)}
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    <MessageArea
                        curSenderUsername={auth.username}
                        chatMessages={curChatMessages}
                        displaySpinner={displayMessageSpinner}
                    />
                </div>
                <div className="shrink-0">
                    <MessageInputTool
                        curUsername={auth.username}
                        curConversationId={selectedConversation?.id}
                        sendToServer={sendToServer}
                    />
                </div>
            </div>
            <ConversationDetailsSlide
                open={isDetailConversationOpen}
                onClose={() => setIsDetailConversationOpen(false)}
                conversation={selectedConversation}
            />
        </div>
    );
}

export default ChatPage;