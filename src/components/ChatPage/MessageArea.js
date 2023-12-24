import MessageItem from "./MessageItem";
import LoadingSpinner from "../LoadingSpinner";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";

const MessageArea = ({ parentRef, curSenderUsername, chatMessages, displaySpinner }) => {
    const messageAreaRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(
                messageAreaRef.current.scrollTop <
                messageAreaRef.current.scrollHeight - messageAreaRef.current.clientHeight
            );
        };

        messageAreaRef.current.addEventListener('scroll', handleScroll);

        return () => {
            if (messageAreaRef.current) {
                const currentRef = messageAreaRef.current;
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }, [chatMessages]);

    const handleScrollDown = () => {
        messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    };

    useEffect(() => {
        parentRef.current = { handleScrollDown };
    }, [parentRef]);

    return (
        <div className="relative h-full">
            <ul className="border rounded h-full p-2 overflow-y-auto overflow-x-hidden"
                ref={messageAreaRef}
            >
                {displaySpinner ? (
                    <LoadingSpinner loadingTitle={"Messages..."} />
                ) : (
                    chatMessages.map((chatMessage) => (
                        <MessageItem
                            key={chatMessage?.id}
                            curSenderUsername={curSenderUsername}
                            chatMessage={chatMessage}
                        />
                    ))
                )}
            </ul>
            {showScrollButton && (
                <button
                    onClick={handleScrollDown}
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2
                        bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none
                        duration-300 transition-shadow animate-bounce p-2 z-10"
                >
                    <FontAwesomeIcon icon={faChevronDown} size="xl"/>
                </button>
            )}
        </div>
    );
};

export default MessageArea;
