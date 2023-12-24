const RecipientItem = ({ chatMessage }) => (
    <li className="flex my-3">
        <input type="hidden" name="username" value={chatMessage?.senderUsername} />
        <div>
            <img
                src={require('./../../assets/avatar/male.png')}
                alt="Sender's Image"
                className="rounded-full h-8 w-8 object-cover mr-2"
            />
        </div>
        <div className="flex-1">
            <div className="flex flex-col my-3">
                <span className="font-semibold text-gray-700">{chatMessage?.senderUsername}</span>
                <ul className="flex-wrap space-y-1">
                    <RecipientLi id={chatMessage?.id} content={chatMessage?.content} sendingTime={chatMessage?.sendingTime}/>
                </ul>
            </div>
        </div>
    </li>
)

const RecipientLi = ({ id, content, sendingTime }) => {
    const timeToDisplay = formattedTime(sendingTime);

    return (
        <li id={id} className="flex flex-wrap justify-start">
            <div className="border rounded-lg bg-gray-200 text-black p-2 max-w-2xl">
                <p className="break-all">{content}</p>

                {timeToDisplay && (
                    <p className="text-xs text-gray-600 mt-1">{timeToDisplay}</p>
                )}
            </div>
        </li>
    );
};

const SenderItem = ({ chatMessage }) => (
    <li className="flex justify-end">
        <input type="hidden" name="username" value={chatMessage?.senderUsername} />
        <ul className="flex-wrap space-y-1">
            <SenderLi id={chatMessage?.id} content={chatMessage?.content} sendingTime={chatMessage?.sendingTime} />
        </ul>
    </li>
);

const SenderLi = ({ id, content, sendingTime }) => {
    const timeToDisplay = formattedTime(sendingTime);

    return (
        <li id={id} className="flex justify-end">
            <div className="border rounded-lg bg-blue-500 text-white p-2 w-full max-w-2xl">
                <p className="break-all">{content}</p>
                {timeToDisplay && (
                    <p className="text-xs text-gray-600 mt-1">{timeToDisplay}</p>
                )}
            </div>
        </li>
    );
};

const formattedTime = (sendingTime) => {
    const currentDate = new Date();
    const messageDate = new Date(sendingTime);

    if (currentDate.getDate() !== messageDate.getDate()) {
        return '';
    }

    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const NotificationItem = ({ chatMessage }) => {
    const { id, content } = chatMessage;

    return (
        <div id={id} className="text-center my-3 text-secondary">
            <p className="text-wrap">{content}</p>
        </div>
    );
}

const MessageItem = ({ curSenderUsername, chatMessage }) => {
    if (chatMessage.type === 'NOTIFICATION') {
        return <NotificationItem chatMessage={chatMessage}/>
    }
    if (chatMessage.senderUsername === curSenderUsername) {
        return <SenderItem chatMessage={chatMessage}/>
    }
    return <RecipientItem chatMessage={chatMessage}/>
}

export default MessageItem;