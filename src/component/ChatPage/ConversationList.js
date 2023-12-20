import ConversationItem from "./ConversationItem";
import LoadingSpinner from "../LoadingSpinner";

const ConversationList = ({conversations, onlineUsernames, handleConversationItemClick}) => {

    const hide = true;

    const addConversationItems = () => {

    }

    return (
        <div className="h-full">
            {hide ?
                <LoadingSpinner
                    loadingTitle={"Conversation..."}
                />
                :
                <ul className="list-group overflow-y-scroll">
                    {conversations && conversations.map((conversation) => (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            onlineUsernames={onlineUsernames}
                            handleConversationItemClick={handleConversationItemClick}
                        />
                    ))
                    }
                </ul>
            }
        </div>
    );
}

export default ConversationList;