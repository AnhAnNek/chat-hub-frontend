import axios from "axios";
import {ORIGINAL_API_URL} from "../utils/base";
import {bearerAuth} from "../utils/authUtils";

const USER_API_URL = `${ORIGINAL_API_URL}/api/users`;

const getAll = async () => {
    const apiUrl = `${USER_API_URL}/get-all`;
    const response = await axios.get(apiUrl, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.data;
}

const getUserWithoutCurUser = async (accessToken, username) => {
    const apiUrl = `${USER_API_URL}/get-all-without-cur-user?username=${username}`;
    const response = await axios.get(apiUrl, {
        headers: { 'Authorization': bearerAuth(accessToken) }
    });
    return response.data;
}

const getUnchattedUsers = async (accessToken, username) => {
    const apiUrl = `${USER_API_URL}/get-unchatted-users?curUsername=${username}`;
    const response = await axios.get(apiUrl, {
        headers: { 'Authorization': bearerAuth(accessToken) }
    });
    return response.data;
}

const getOnlineUsers = async (accessToken) => {
    const apiUrl = `${USER_API_URL}/get-online-users`;
    const response = await axios.get(apiUrl, {
        headers: { 'Authorization': bearerAuth(accessToken) }
    });
    return response.data;
}

const UserService = {
    getAll,
    getUserWithoutCurUser,
    getUnchattedUsers,
    getOnlineUsers
}

export default UserService;
