import axios from 'axios';
import {ORIGINAL_API_URL} from "../utils/base";

const AUTH_API_URL = `${ORIGINAL_API_URL}/api/auth`;

const login = async (username, plainPass) => {
    try {
        const restUrl = `${AUTH_API_URL}/login`;
        const response = await axios.post(
            restUrl,
            {
                username: username,
                plainPass: plainPass,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            console.log('Login successful');
            const auth = response.data;
            return auth;
        }
    } catch (error) {
        console.error('Login failed', error);
        throw new Error('Login failed: Network error or other issue');
    }
    throw new Error('Your username or password is incorrect. Please try again.');
};

const register = async (user) => {
    try {
        const restUrl = `${AUTH_API_URL}/register`;
        const response = await axios.post(
            restUrl,
            user,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            console.log('Register successful');
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Register failed', error);
        return false;
    }
};

const AuthService = {
    login,
    register
}

export default AuthService;
