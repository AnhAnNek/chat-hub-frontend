import ConversationItem from "./ConversationItem";

const ConversationList = ({ conversations, onlineUsernames, handleConversationItemClick }) => {

    const addConversationItems = () => {

    }

    return (
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
    );
}

export default ConversationList;