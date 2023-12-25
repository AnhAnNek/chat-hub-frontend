import {useEffect, useState} from "react";
import { classNames } from '../../utils/base';

const ConversationItem = ({
                      conversation,
                      handleConversationItemClick
}) => {
    const avatar = require('../../assets/avatar/male.png');

    const conversationId = conversation.id;

    let isOnline = Boolean(conversation?.isOnline);
    let isSelected = Boolean(conversation?.isSelected);

    let name = conversation.name;
    let lastMessage = conversation.lastMessageDTO || {};
    let lastMessageContent = lastMessage.content ? lastMessage.content : '';
    let lastSendingTime = lastMessage.sendingTime;

    const [timeAgo, setTimeAgo] = useState(calculateTimeAgo(lastSendingTime));

    useEffect(() => {
        if (!conversation) {
            console.error("conversation is null");
            return;
        }

        const interval = setInterval(() => {
            setTimeAgo(calculateTimeAgo(lastSendingTime));
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    function calculateTimeAgo(timestamp) {
        const now = new Date();
        const sentTime = new Date(timestamp);
        const timeDifference = now - sentTime;

        const seconds = Math.floor(timeDifference / 1000);

        if (seconds < 60) {
            return `${seconds} seconds ago`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (seconds < 86400) {
            const hours = Math.floor(seconds / 3600);
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
        } else {
            const days = Math.floor(seconds / 86400);
            return `${days} ${days === 1 ? 'day' : 'days'} ago`
        }
    }

    return (
        <li id={conversationId}
            onClick={() => handleConversationItemClick(conversation)}
            className={classNames(
                'flex',
                'justify-between',
                'gap-x-6',
                'px-5',
                'py-5',
                'rounded-lg',
                'hover:bg-white',
                'transition duration-75',
                { 'bg-white': isSelected }
            )}
        >
            <div className="flex min-w-0 gap-x-4">
                <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={avatar} alt="" />
                <div className="min-w-0 flex flex-col">
                    <p className="text-lg truncate font-semibold leading-6 text-gray-900">{name}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{lastMessageContent}</p>
                </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="mt-1 text-xs leading-5 text-gray-500">
                    <time dateTime={lastSendingTime}>{timeAgo}</time>
                </p>
                <div className="mt-1 flex items-center gap-x-1.5"
                     style={{ display: isOnline ? '' : 'none' }}
                >
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
            </div>
        </li>
    )
}

export default ConversationItem;