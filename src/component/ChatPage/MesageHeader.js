import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfo} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const MessageHeader = ({ conversation }) => {

    return (
        <div className="flex flex-wrap">
            <div className="w-full sm:w-3/4 mb-4 flex">
                <img src={require('../../assets/avatar/female.jpeg')}
                     className="border border-slate-300 rounded-full me-3"
                     style={{height: '50px', width: '50px'}} alt="Current User Avatar"/>
                <div className="flex flex-col w-full">
                    <h5 className="w-full overflow-hidden overflow-ellipsis text-2xl"
                    >{conversation.name}</h5>
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        <p className="text-xs text-gray-500">Active now</p>
                    </div>
                </div>
            </div>
            <div className="w-full sm:w-1/4 mb-4">
                <div className="flex items-center justify-end space-x-3">
                    <a href="/show-unchatted-users">
                        <FontAwesomeIcon icon={faInfo} size="x"/>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default MessageHeader;