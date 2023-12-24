import LoadingSpinner from "../LoadingSpinner";
import ConversationItem from "./ConversationItem";
import {useState} from "react";

const ConversationList = ({ conversations, displaySpinner, handleConversationItemClick }) => {
    const [clickedItemId, setClickedItemId] = useState(null);

    const handleItemClick = (conversation) => {
        debugger
        handleConversationItemClick(conversation);
        setClickedItemId(conversation.id);
    };

    return (
        <div className="h-full">
            {displaySpinner ?
                <LoadingSpinner
                    loadingTitle={"Conversation..."}
                />
                :
                <ul className="divide-y divide-gray-100 px-2">
                    {conversations.map((conversation) => (
                        <ConversationItem
                            key={conversation?.id}
                            conversation={conversation}
                            isOnline={true}
                            isClicked={clickedItemId === conversation.id}
                            handleConversationItemClick={handleItemClick}
                        />
                    ))}
                </ul>
            }
        </div>
    );
}

export default ConversationList;