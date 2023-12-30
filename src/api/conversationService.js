import axios from "axios";
import {ORIGINAL_API_URL} from "../utils/base";
import {bearerAuth} from "../utils/authUtils";

const CONV_API_URL = `${ORIGINAL_API_URL}/api/conversations`;

const getConversations = async (accessToken, username) => {
    const apiUrl = `${CONV_API_URL}/get-conversations?username=${username}`;
    const response = await axios.get(apiUrl, {
        headers: { 'Authorization': bearerAuth(accessToken) }
    });
    return await response.data;
}

const ConversationService = {
    getConversations
}

export default ConversationService;
