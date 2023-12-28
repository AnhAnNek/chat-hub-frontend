import { useState } from 'react';
import axios from 'axios';
import {ORIGINAL_API_URL} from "../utils/base";

const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);

    const login = async (username, plainPass) => {
        try {
            const restUrl = `${ORIGINAL_API_URL}/api/login/login-process`;
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
                sessionStorage.setItem('username', username);
                setIsLoading(true);

                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Login failed', error);
            return false;
        }
    };

    const logout = () => {
        sessionStorage.clear();
    };

    const setLoading = (value) => {
        setIsLoading(value);
    };

    return { login, logout, isLoading, setLoading };
};

export default useLogin;
