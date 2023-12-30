import {useEffect, useState} from "react";
import { classNames } from '../../utils/base';

const ConversationItem = ({
                      conversation,
                      onClickItem
}) => {
    const avatar = require('../../assets/avatar/male.png');

    const conversationId = conversation.id;

    const isOnline = Boolean(conversation?.isOnline);
    const isSelected = Boolean(conversation?.isSelected);

    const name = conversation.name;
    const lastMessage = conversation.lastMessageDTO || {};
    const lastMessageContent = lastMessage.content ? lastMessage.content : '';
    const lastSendingTime = lastMessage.sendingTime;

    const [timeAgo, setTimeAgo] = useState(calculateTimeAgo(lastSendingTime));

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

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeAgo(calculateTimeAgo(lastSendingTime));
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <li id={conversationId}
            onClick={() => onClickItem(conversation)}
            className={classNames(
                'flex justify-between gap-x-6 px-2 py-5',
                'rounded-lg hover:bg-slate-50 transition duration-75',
                isSelected && 'bg-white'
            )}
        >
            <div className="flex min-w-0 gap-x-4">
                <div className="h-12 w-12 flex-none relative">
                    <img src={avatar} alt="" className="rounded-full"/>
                    <div className={classNames('absolute bottom-0 right-0 bg-white',
                            'border-2 rounded-full transition-opacity duration-500 ease-in-out')}
                         style={{ opacity: isOnline ? 1 : 0 }}
                    >
                        <div className="flex-none rounded-full">
                            <div className="h-3 w-3 rounded-full bg-green-500"
                            />
                        </div>
                    </div>
                </div>
                <div className="min-w-0 flex flex-col">
                    <p className="text-lg truncate font-semibold leading-6 text-gray-900">{name}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">{lastMessageContent}</p>
                </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="mt-1 text-xs leading-5 text-gray-500">
                    <time dateTime={lastSendingTime}>{timeAgo}</time>
                </p>
                {conversation.unreadMessages !== 0 && (
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1
                    text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">{conversation.unreadMessages}</span>
                )}
            </div>
        </li>
    )
}

export default ConversationItem;