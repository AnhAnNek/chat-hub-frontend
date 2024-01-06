import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'react-feather';


UserSelectedItem.propTypes = {
    userID: PropTypes.string,
    userName: PropTypes.string,
    isOnline: PropTypes.bool,
    onCancel: PropTypes.func,
};

const avatar = require('../../assets/avatar/male.png');

function UserSelectedItem(props) {
    return (
        <li className="flex items-center border p-2 mb-2 rounded-md">
            <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" src={avatar} alt={props.userName + "avatar"} />
                </div>
            </div>
            <div className="ml-2">
                <p className="text-lg text-xs">{props.userName}</p>
            </div>
            <div className="ml-auto">
                <button onClick={props.onCancel} className="text-red-500 w-4 h-4">
                    <X className='w-full h-full' />
                </button>
            </div>
        </li>
    );
}

export default UserSelectedItem;