import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import ConversationSearchBar from "../ChatPage/ConversationSearchBar";
import UserSelectedList from "../User/UserSelectedList"
import UserList from "../User/UserList"
import UserService from "../../api/userService";
import { useAuth } from "../../contexts/AuthContext";


function AddGroupPage() {
    const { auth } = useAuth();
    const [curUserList] = useState([]);
    const [curSearchedUserList, setCurSearchedUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const AT_LEAST_CHARACTERS = 4
    const LimitedQuantity = 10

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

    const [listUser, setListUser] = useState([
        {
            "username": "hoanglong",
            "fullName": "Hoàng Long",
            "email": "user2@gmail.com",
            "gender": "FEMALE"
        },
        {
            "username": "thanhlong",
            "fullName": "Thành Long",
            "email": "user3@gmail.com",
            "gender": "MALE"
        },
        {
            "username": "tackehoa",
            "fullName": "Tackle Hoa",
            "email": "user5@gmail.com",
            "gender": "FEMALE"
        },
        {
            "username": "thaonguyen",
            "fullName": "Nguyên Thảo",
            "email": "user6@gmail.com",
            "gender": "FEMALE"
        },
        {
            "username": "hanguyen",
            "fullName": "Nguyễn Hạ",
            "email": "user7@gmail.com",
            "gender": "FEMALE"
        },
        {
            "username": "phuochoang",
            "fullName": "Phước Hoàng",
            "email": "user8@gmail.com",
            "gender": "FEMALE"
        }
    ])

    const fetchOnlineUsers = async () => {
        try {
            //const onlineUsernames = await UserService.getOnlineUsers(auth.accessToken);
            const onlineUsernames = ["phuochoang", "hanguyen"]
            updateOnlineStatus(onlineUsernames);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const updateOnlineStatus = (onlineUsernames) => {
        const newListUser = listUser.map(item => {
            if (onlineUsernames.includes(item?.username)) {
                return { ...item, isOnline: true };
            } else {
                return { ...item, isOnline: false };
            }
        });
        setListUser(newListUser);
    }

    const [listUserSelected, setListUserSelected] = useState([]);

    const [groupName, setGroupName] = useState("");

    const addGroup = async () => {
        let data = {
            'curUsername': 'vananek',
            'conversationName': groupName,
            'memberUsernames': listUserSelected
        }
        //CALL API
        console.log(data);
    }

    const handleSelectUser = async (userName) => {
        if (listUserSelected.includes(userName) || listUserSelected.length >= LimitedQuantity)
            return;
        setListUserSelected(prev => [...prev, userName]);
        fetchOnlineUsers();
    }

    const handleCancel = async (userName) => {
        setListUserSelected(prev => prev.filter(user => user !== userName));
    };

    return (
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className='min-w-[700px] mx-auto p-4 border rounded shadow-md'>
                <ConversationSearchBar onSearch={onSearch} />
                <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2 mt-2" htmlFor="groupName">
                        Group Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-1/1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="groupName"
                        type="text"
                        placeholder="Enter group name"
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    />
                </div>
                <div className='flex flex-row justify-between mt-2'>
                    <div className='w-full p-2'>
                        <UserList onSelectUser={handleSelectUser} userList={listUser}></UserList>
                    </div>
                    <div className='w-auto p-2 border rounded shadow-md'>
                        <UserSelectedList limitedQuantity={LimitedQuantity} userSelectedList={listUserSelected} onCancel={handleCancel}></UserSelectedList>
                    </div>
                </div>
                <div className='w-full h-30 p-4 flex justify-center'>
                    <button
                        type="submit"
                        className="flex w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={addGroup}
                        disabled={listUserSelected.length === 0}
                    >
                        {isLoading ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} size="xl" spin style={{ color: "#ffffff", }} />
                                <span className="ml-2">add...</span>
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