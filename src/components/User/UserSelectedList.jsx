import React from 'react';
import PropTypes from 'prop-types';
import { X } from 'react-feather';

UserSelectedList.propTypes = {
    userSelectedList: PropTypes.array,
    limitedQuantity: PropTypes.number,
    onCancel: PropTypes.func,
};

UserSelectedList.defaultProps = {
    userSelectedList: [],
    limitedQuantity: 0,
};

const UserSelectedItem = ({ username, onCancel }) => {
    const avatar = require('../../assets/avatar/male.png');
    return (
        <li className="flex items-center border p-2 mb-2 rounded-md cursor-pointer" >
            <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" src={avatar} alt={username + "avatar"} />
                </div>
            </div>
            <div className="ml-2">
                <p className="text-lg text-xs">{username}</p>
            </div>
            <div className="ml-auto">
                <button onClick={() => onCancel(username)} className="text-red-500 w-4 h-4">
                    <X className='w-full h-full' />
                </button>
            </div>
        </li >
    );
}

function UserSelectedList(props) {
    const curSize = props.userSelectedList.length;
    return (
        <div className='p-1'>
            <p className='text-slate-400 text-center mb-2'>{curSize}/{props.limitedQuantity}</p>
            {props.userSelectedList.map((element, index) => (
                <UserSelectedItem key={index} username={element} onCancel={props.onCancel} />
            ))}
        </div>
    );
}

export default UserSelectedList;