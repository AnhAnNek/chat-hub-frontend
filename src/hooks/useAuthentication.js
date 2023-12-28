import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthentication = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const username = sessionStorage.getItem("username");
        setIsLogin(username !== null);

        if (isLogin) {
            navigate("/chat-page");
        } else {
            navigate("/login");
        }
    }, [navigate]);

    return { isLogin };
};
