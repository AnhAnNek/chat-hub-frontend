import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faUsers, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const ConversationHeader = ({ username }) => {
    return (
        <div className="flex flex-wrap">
            <div className="w-full sm:w-1/2 mb-4 flex">
                <img src={require('../../assets/avatar/male.png')}
                     className="border border-slate-300 rounded-full me-3"
                     style={{height: '40px', width: '40px'}} alt="Current User Avatar"/>
                <h5 className="font-bold w-full overflow-hidden overflow-ellipsis"
                    style={{ maxWidth: '100%' }}>{username}</h5>
            </div>
            <div className="w-full sm:w-1/2 mb-4">
                <div className="flex items-center justify-end space-x-3">
                    <a href="/show-unchatted-users" className="me-3">
                        <FontAwesomeIcon icon={faCommentDots} />
                    </a>

                    <a href="/show-add-group" className="me-3">
                        <FontAwesomeIcon icon={faUsers} />
                    </a>

                    <a href="/logout">
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ConversationHeader;