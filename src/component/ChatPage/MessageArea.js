import MessageItem from "./MessageItem";

const MessageArea = ({ curSenderUsername, chatMessages }) => {
    return (
        <div className="border rounded h-full p-2 overflow-y-auto">
            {chatMessages.map((chatMessage) => (
                <MessageItem
                    curSenderUsername={curSenderUsername}
                    chatMessage={chatMessage}
                />
            ))}
        </div>
    );
};

export default MessageArea;
