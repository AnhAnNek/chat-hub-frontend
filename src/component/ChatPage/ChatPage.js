import ConversationHeader from "./ConversationHeader";
import ConversationSearchBar from "./ConversationSearchBar";
import MessageHeader from "./MesageHeader";
import MessageArea from "./MessageArea";
import MessageInputTool from "./MessageInputTool";
import {useState} from "react";
import ConversationDetailsSlide from "./ConversationDetailsSlide";
import ConversationList from "./ConversationList";

const ChatPage = () => {
    const curSenderUsername = 'vanannek';
    const conversationId = '123123123';

    const exampleChatMessage = {
        id: '123213',
        content: 'hello',
        type: 'CHAT',
        senderUsername: 'vanannek',
        conversationId: conversationId
    };

    const exampleConversation = {
        id: conversationId,
        type: 'PRIVATE',
        name: 'zoan',
        lastMessageDTO: exampleChatMessage,
        lastTimeAgo: 'few seconds ago'
    };

    const [curConverstaion, setCurConverstaion] = useState(exampleConversation);

    const [chatMessages, setChatMessages] = useState([
        {
            id: '1',
            content: 'Hello there!',
            type: 'CHAT',
            senderUsername: 'vanannek',
            conversationId: '123123123',
        },
        {
            id: '2',
            content: 'How are you?',
            type: 'CHAT',
            senderUsername: 'zoan',
            conversationId: conversationId,
        },
        // {
        //     id: '3',
        //     content: 'I\'m doing well, thank you!',
        //     type: 'CHAT',
        //     senderUsername: 'vanannek',
        //     conversationId: conversationId
        // },
        exampleChatMessage
    ])

    const [isDetailConversationOpen, setIsDetailConversationOpen] = useState(false);

    const onSendMessage = (newChatMessage) => {
        setChatMessages((prevChatMessages) =>
            [...prevChatMessages, newChatMessage]);
    }

    return (
        <div className="flex flex-wrap">
            <div className="w-full md:w-1/3 bg-gray-100 p-5 h-screen flex flex-col">
                <div className="flex-shrink-0">
                    <ConversationHeader username={curSenderUsername}/>
                    <ConversationSearchBar/>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <ConversationList/>
                    {/*<ConversationItem*/}
                    {/*    conversation={exampleConversation}*/}
                    {/*    onlineUsernames={[]}*/}
                    {/*    handleConversationItemClick={() => {}}*/}
                    {/*/>*/}
                </div>
            </div>

            <div className="w-full md:w-2/3 p-4 h-screen flex flex-col">
                <div>
                    <MessageHeader
                        conversation={exampleConversation}
                        onOpenDetailConversation={() => setIsDetailConversationOpen(true)}
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    <MessageArea
                        curSenderUsername={curSenderUsername}
                        chatMessages={chatMessages}
                    />
                </div>
                <div className="shrink-0">
                    <MessageInputTool
                        curUsername={curSenderUsername}
                        curConversationId={curConverstaion.id}
                        onSendMessage={onSendMessage}
                    />
                </div>
            </div>
            <ConversationDetailsSlide
                open={isDetailConversationOpen}
                onClose={() => setIsDetailConversationOpen(false)}
            />
        </div>
    );
}

export default ChatPage;