import LoadingSpinner from "../LoadingSpinner";
import ConversationItem from "./ConversationItem";

const ConversationList = ({ conversations, displaySpinner, handleConversationItemClick }) => {
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
                            isOnline={Boolean(conversation?.isOnline)}
                            isSelected={Boolean(conversation?.isSelected)}
                            onClickItem={handleConversationItemClick}
                        />
                    ))}
                </ul>
            }
        </div>
    );
}

export default ConversationList;