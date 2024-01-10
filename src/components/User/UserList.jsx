import React from 'react';
import PropTypes from 'prop-types';

UserList.propTypes = {
    userList: PropTypes.array,
    onSelectUser: PropTypes.func,
};

UserList.defaultProps = {
    userList: [],
};

const UserItem = ({ username, isOnline, onSelectUser }) => {
    const avatar = require('../../assets/avatar/male.png');
    return (
        <li onClick={() => onSelectUser(username)} className="flex items-center border p-2 mb-2 rounded-md gap-2 cursor-pointer">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" src={avatar} alt={username + "avatar"} />
                </div>
            </div>
            <div className="ml-4">
                <p className="text-lg font-bold">{username}</p>
            </div>
            <div>
                <div
                    className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'
                        }`}
                ></div>
            </div>
        </li>
    );
}

function UserList(props) {
    return (
        <ul>
            {props.userList.map((user, index) => (
                <UserItem key={index} onSelectUser={props.onSelectUser} username={user.username} isOnline={user.isOnline}></UserItem>
            ))}
        </ul>
    );
}

export default UserList;