import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthentication = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem("username") === null) {
            navigate("/login");
        } else {
            navigate("/chat-page");
        }
    }, [navigate]);
};
