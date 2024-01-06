import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ConversationSearchBar from "../ChatPage/ConversationSearchBar";
import UserSelectedList from "../User/UserSelectedList"
import UserList from "../User/UserList"

function AddGroupPage() {
    const [curUserList] = useState([]);
    const [curSearchedUserList, setCurSearchedUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const AT_LEAST_CHARACTERS = 99

    const onSearch = (searchTerm) => {
        if (searchTerm === undefined || searchTerm === null || searchTerm.length < AT_LEAST_CHARACTERS) {
            setCurSearchedUserList(curSearchedUserList);
            return;
        }

        const searchedConversations = curUserList.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCurSearchedUserList(searchedConversations);
    };

    const [listUser] = useState([
        { id: 1, name: 'John Doe', isOnline: true, },
        { id: 2, name: 'Jane Doe', isOnline: false, },
    ]);

    const [listUserSelected] = useState([
        { id: 1, name: 'John Doe', isOnline: true },
    ]);

    const addGroup = async (e) => {
        e.preventDefault();
        console.log("add group")
    }
    return (
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className='min-w-[700px] mx-auto p-4 border rounded shadow-md'>
                <ConversationSearchBar onSearch={onSearch} />
                <div className='flex flex-row justify-between mt-2'>
                    <div className='w-full p-2'>
                        <UserList data={listUser}></UserList>
                    </div>
                    <div className='w-auto p-2 border rounded shadow-md'>
                        <UserSelectedList data={listUserSelected}></UserSelectedList>
                    </div>
                </div>
                <div className='w-full h-30 p-4 flex justify-center'>
                    <button
                        type="submit"
                        className="flex w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={addGroup}
                    >
                        {isLoading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} size="xl" spin style={{ color: "#ffffff", }} />
                                <span className="ml-2">Login...</span>
                            </>
                        ) : (
                            <>
                                Add Group
                            </>
                        )}

                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddGroupPage;