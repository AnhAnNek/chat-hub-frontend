import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";

const CustomButton = ({ onClick, bgColor, textColor, icon, label }) => (
    <button onClick={onClick} className={`bg-${bgColor} text-${textColor} px-10 py-4 rounded-xl shadow-2xl flex flex-col items-center space-y-2`}>
        <FontAwesomeIcon icon={icon}/>
        <span className="text-xs">{label}</span>
    </button>
);

const ConversationDetailsHeader = ({ conversation, membersQty }) => {
    const isPrivateConversation = () =>  {
        return conversation?.type === 'PRIVATE';
    }

    const onClickAddGroup = () => {

    };

    const onClickAddMember = () => {

    };

    const onClickLeaveGroup = () => {

    };

    const onClickDeleteHistory = () => {

    };

    return (
        <div className="flex flex-col items-center">
            <div className="w-full text-center space-y-3">
                <img
                    src={require('./../../../assets/avatar/female.jpeg')}
                    alt="Conversation image"
                    className="border border-slate-300 rounded-full h-24 w-24 object-cover mx-auto"
                />
                <h5 className="text-xl font-semibold mt-2">{conversation?.name}</h5>
                {!isPrivateConversation() && (
                    <p className="text-gray-500 text-sm">
                        {`${membersQty} members`}
                    </p>
                )}
            </div>
            <div className="flex space-x-4 mt-10">
                {isPrivateConversation() ? (
                    <CustomButton onClick={onClickAddGroup} bgColor="white"
                                  textColor="blue-700" icon={faPlus} label="Group" />
                ) : (
                    <>
                        <CustomButton onClick={onClickAddMember} bgColor="white"
                                      textColor="blue-700" icon={faPlus} label="Member" />
                        <CustomButton onClick={onClickLeaveGroup} bgColor="white"
                                      textColor="red-600" icon={faArrowRightFromBracket} label="Leave" />
                    </>
                )}
                <CustomButton onClick={onClickDeleteHistory} bgColor="white"
                              textColor="red-600" icon={faTrash} label="History" />
            </div>
        </div>
    );
};

export default ConversationDetailsHeader;
