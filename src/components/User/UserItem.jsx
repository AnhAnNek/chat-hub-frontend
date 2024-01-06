import React from 'react';
import PropTypes from 'prop-types';

UserItem.propTypes = {
    userID: PropTypes.string,
    userName: PropTypes.string,
    isOnline: PropTypes.bool,
};

const avatar = require('../../assets/avatar/male.png');

function UserItem(props) {
    return (
        <li className="flex items-center border p-2 mb-2 rounded-md gap-2">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" src={avatar} alt={props.userName + "avatar"} />
                </div>
            </div>
            <div className="ml-4">
                <p className="text-lg font-bold">{props.userName}</p>
            </div>
            <div>
                <div
                    className={`w-4 h-4 rounded-full ${props.isOnline ? 'bg-green-500' : 'bg-red-500'
                        }`}
                ></div>
            </div>
        </li>
    );
}

export default UserItem;