import LoadingSpinner from "../LoadingSpinner";
import {useEffect, useState} from "react";
import ConversationItem from "./ConversationItem";

const ConversationList = ({ handleConversationItemClick }) => {

    const [conversations, setConversations] = useState([]);
    const [displaySpinner, setDisplaySpinner] = useState(true);

    const fetchConversations = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/conversations/get-conversations?username=vanannek`);
            const data = await response.json();
            console.log(data);
            setConversations(data);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setDisplaySpinner(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    return (
        <div className="h-full">
            {displaySpinner ?
                <LoadingSpinner
                    loadingTitle={"Conversation..."}
                />
                :
                <ul className="divide-y divide-gray-100">
                    {conversations.map((conversation) => (
                        <ConversationItem
                            conversation={conversation}
                            isOnline={true}
                            handleConversationItemClick={handleConversationItemClick}
                        />
                    ))}
                </ul>
            }
        </div>
    );
}

export default ConversationList;