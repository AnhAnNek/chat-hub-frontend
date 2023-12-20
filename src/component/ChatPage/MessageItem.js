const RecipientItem = ({ chatMessage }) => (
    <li className="flex my-3">
        <input type="hidden" name="username" value={chatMessage.senderUsername} />
        <div>
            <img
                src={require('./../../assets/avatar/male.png')}
                alt="Sender's Image"
                className="rounded-full h-8 w-8 object-cover mr-2"
            />
        </div>
        <div className="flex-1">
            <div className="flex flex-col my-3">
                <span className="font-semibold text-gray-700">{chatMessage.senderUsername}</span>
                <ul className="oldstyle-nums flex flex-col">
                    <RecipientLi id={chatMessage.id} content={chatMessage.content}/>
                    <RecipientLi id={'asd'} content={"a;sldkjsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjf" +
                        "sldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjff"}/>
                </ul>
            </div>
        </div>
    </li>
)

const RecipientLi = ({ id, content }) => (
    <li id={id} className="w-full whitespace-pre-wrap">
        <div className="border rounded-md bg-gray-200 inline-block p-2">
            <p className="text-wrap">{content}</p>
        </div>
    </li>
)

const SenderItem = ({ chatMessage }) => (
    <li className="flex justify-end">
        <ul className="flex-wrap">
            <SenderLi id={chatMessage.id} content={chatMessage.content}/>
            <SenderLi id={chatMessage.id} content={"a;sldkjsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjf" +
                "sldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjfsldkjff"}/>
        </ul>
    </li>
)

const SenderLi = ({ id, content }) => (
    <li id={id} className="w-full">
        <div className="border rounded-md bg-blue-500 text-white inline-block max-w-content p-2">
            <p className="text-wrap">{content}</p>
        </div>
    </li>
)

const NotificationItem = ({ chatMessage }) => {
    const { id, content } = chatMessage;

    return (
        <div className="text-center my-3 text-secondary">
            <ul className="list-unstyled">
                <li id={id} className="mt-1">
                    <p className="text-wrap">{content}</p>
                </li>
            </ul>
        </div>
    );
}

const MessageItem = ({ curSenderUsername, chatMessage }) => {
    if (chatMessage.type === 'NOTIFICATION') {
        return <NotificationItem content={chatMessage.content}/>
    }
    if (chatMessage.senderUsername === curSenderUsername) {
        return <SenderItem chatMessage={chatMessage}/>
    }
    return <RecipientItem chatMessage={chatMessage}/>
}

export default MessageItem;