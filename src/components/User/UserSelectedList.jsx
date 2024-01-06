import React from 'react';
import PropTypes from 'prop-types';
import UserSelectedItem from './UserSelectedItem'

UserSelectedList.propTypes = {
    userSelectedList: PropTypes.array,
    handleCancel: PropTypes.func,
};

UserSelectedList.defaultProps = {
    userSelectedList: [],
};


function UserSelectedList(props) {
    return (
        <div className='p-1'>
            {props.userSelectedList.map((item) => (
                <UserSelectedItem key={item.id} name={item.name} onCancel={() => props.handleCancel(item.name)} />
            ))}
        </div>
    );
}

export default UserSelectedList;