import axios from "axios";
import {ORIGINAL_API_URL} from "../utils/base";
import {bearerAuth} from "../utils/authUtils";

const MESSAGE_API_URL = `${ORIGINAL_API_URL}/api/messages`;

const getMessages = async (accessToken, conversationId) => {
    const apiUrl = `${MESSAGE_API_URL}/get-messages?conversationId=${conversationId}`;
    const response = await axios.get(apiUrl, {
        headers: { 'Authorization': bearerAuth(accessToken) }
    });
    return response.data;
}

const MessageService = {
    getMessages
};

export default MessageService;
