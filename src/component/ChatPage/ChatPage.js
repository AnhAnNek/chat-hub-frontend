import ConversationHeader from "./ConversationHeader";
import ConversationSearchBar from "./ConversationSearchBar";
import MessageHeader from "./MesageHeader";
import MessageArea from "./MessageArea";
import MessageInputTool from "./MessageInputTool";
import {useEffect, useState} from "react";
import ConversationDetailsSlide from "./ConversationDetailsSlide/ConversationDetailsSlide";
import ConversationList from "./ConversationList";
import {data} from "autoprefixer";

const ChatPage = () => {
    const ORIGINAL_URL = 'http://localhost:8000';

    const curSenderUsername = 'vanannek';

    const [curConversations, setCurConversations] = useState([]);
    const [curSearchedConversations, setCurSearchedConversations] = useState([]);
    const [curConversation, setCurConversation] = useState({name: "Unknown"});
    const [displayConversationSpinner, setDisplayConversationSpinner] = useState(true);
    const [curChatMessages, setCurChatMessages] = useState([]);
    const [displayMessageSpinner, setDisplayMessageSpinner] = useState(true);
    const [isDetailConversationOpen, setIsDetailConversationOpen] = useState(false);

    const fetchConversations = async () => {
        try {
            const restUrl = `${ORIGINAL_URL}/api/conversations/get-conversations?username=${curSenderUsername}`;
            const response = await fetch(restUrl);
            const conversations = await response.json();
            console.log(conversations);
            if (conversations.length > 0) {
                updateCurConversation(conversations[0]);
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

    useEffect(() => {
        fetchConversations();
    }, []);

    const updateCurConversation = (conversation) => {
        setCurConversation(conversation);
        fetchChatMessages(conversation.id);
    };

    const onSendMessage = (newChatMessage) => {
        setCurChatMessages((prevChatMessages) =>
            [...prevChatMessages, newChatMessage]);
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
        if (conversation.id === curConversation.id) {
            return;
        }
        setCurConversation(conversation);
        fetchChatMessages(conversation.id);
    };

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
                        curSenderUsername={curSenderUsername}
                        chatMessages={curChatMessages}
                        displaySpinner={displayMessageSpinner}
                    />
                </div>
                <div className="shrink-0">
                    <MessageInputTool
                        curUsername={curSenderUsername}
                        curConversationId={curConversation.id}
                        onSendMessage={onSendMessage}
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