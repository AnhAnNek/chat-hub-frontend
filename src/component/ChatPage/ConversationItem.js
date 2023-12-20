import {useEffect, useState} from "react";

const ConversationItem = (
    conversation,
    onlineUsernames,
    handleConversationItemClick
) => {
    const [timeAgo, setTimeAgo] = useState(calculateTimeAgo(conversation.lastTimeAgo));

    useEffect(() => {
        if (!conversation) {
            console.error("conversation is null");
            return;
        }

        const interval = setInterval(() => {
            setTimeAgo(calculateTimeAgo(conversation.lastTimeAgo));
        }, 60000);

        return () => clearInterval(interval);
    }, [conversation.lastTimeAgo]);

    const avatar = require('../../assets/avatar/male.png');

    const conversationId = conversation.id;
    const conversationNameId = `conversationName_${conversationId}`;
    const onlineDotId = `onlineDot_${conversationId}`;
    const lastMessageId = `lastMessage_${conversationId}`;
    const lastTimeAgoElementId = `lastTimeAgo_${conversationId}`;

    const name = conversation.name;
    const lastMessageContent = conversation.lastMessageDTO.content ? conversation.lastMessageDTO.content : '';
    const lastTimeAgo = conversation.lastTimeAgo;
    const display = isVisibleOnlineDot(conversation, onlineUsernames);

    function isVisibleOnlineDot(conversation, onlineUsernames) {
        if (conversation.type === 'PRIVATE') {
            const recipientUsername = conversation.name;
            return onlineUsernames.includes(recipientUsername);
        }
        return false;
    }

    function calculateTimeAgo(timestamp) {
        const now = new Date();
    }

    return (
        <li
            className="list-group-item list-group-item-action"
            id={conversationId}
            onClick={() => handleConversationItemClick(conversation)}
        >
            <div className="d-flex w-100 justify-content-between align-items-center">
                <div className="d-flex align-items-center flex-grow-1">
                    <img
                        src={avatar}
                        className="rounded-circle me-3"
                        style={{ height: '40px', width: '40px' }}
                        alt="User Avatar"
                    />
                    <div className="d-grid">
                        <h5
                            id={conversationNameId}
                            className="mb-1 text-truncate"
                            style={{ maxWidth: '80%', fontSize: '18px' }}
                        >
                            {name}
                        </h5>
                        <p
                            id={lastMessageId}
                            className="mb-0 text-truncate text-muted"
                            style={{ maxWidth: '80%', fontSize: '13px' }}
                        >
                            {lastMessageContent}
                        </p>
                    </div>
                </div>
                <div className="text-end">
          <span
              id={onlineDotId}
              className="online-dot"
              style={{ display: display ? 'block' : 'none' }}
          ></span>
                    <small
                        id={lastTimeAgoElementId}
                        className="text-truncate text-muted"
                        style={{ fontSize: '10px' }}
                    >
                        {timeAgo}
                    </small>
                </div>
            </div>
        </li>
    )
}

export default ConversationItem;