import React from 'react';
import PropTypes from 'prop-types';
import UserList from '../User/UserList'

AddPrivateConversationPage.propTypes = {

};

const testUsers = [
    {
        id: 1,
        name: 'Nguyễn Trường An',
        isOnline: true,
    },
    {
        id: 2,
        name: 'Trần Văn An',
        isOnline: true,
    },
    {
        id: 3,
        name: 'Nguyễn Văn Hoàng',
        isOnline: false,
    },
];


function AddPrivateConversationPage(props) {
    return (
        <div>
            <UserList userList={testUsers}></UserList>
        </div>
    );
}

export default AddPrivateConversationPage;

