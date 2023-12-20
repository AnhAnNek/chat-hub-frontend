import { useState } from 'react';

const MessageInputTool = ({ curUsername, curConversationId, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
    };

    const handleSendMessage = () => {
        const content = newMessage.trim();
        if (content !== '') {
            const chatMessage = {
                content: content,
                type: 'CHAT',
                sendingTime: new Date().getTime(),
                senderUsername: curUsername,
                conversationId: curConversationId
            }
            onSendMessage(chatMessage);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="p-4 border-t border-gray-300 flex items-center">
            <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-md border-gray-400 mr-2 focus:outline-none"
            />
            <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none transition duration-300"
            >
                Send
            </button>
        </div>
    );
};

export default MessageInputTool;