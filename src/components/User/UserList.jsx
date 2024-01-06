import React from 'react';
import PropTypes from 'prop-types';
import UserItem from './UserItem';

UserList.propTypes = {
    userList: PropTypes.array,
};

UserList.defaultProps = {
    userList: [],
};

function UserList(userList) {
    return (
        <ul>
            {userList.map(user => (
                <UserItem userID={user.id} userName={user.name}></UserItem>
            ))};
        </ul>
    );
}

export default UserList;