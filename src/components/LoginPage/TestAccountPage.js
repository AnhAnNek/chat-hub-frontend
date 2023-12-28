import {useEffect, useState} from "react";
import {ORIGINAL_API_URL} from "../../utils/base";
import axios from "axios";
import useLogin from "../../hooks/useLogin";
import LoadingButton from "./LoadingButton";
import {useNavigate} from "react-router-dom";
import Header from "../Header";

const TestAccountPage = () => {
    const navigate = useNavigate();

    const { login, isLoading, setLoading } = useLogin();
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const restUrl = `${ORIGINAL_API_URL}/api/users/get-all`;
            const response = await axios.get(restUrl);
            const users = response.data;
            setUsers(users);
        } catch (error) {
            console.log(error);
        }
    }

    const onLoginForEachItem = async (username, plainPass = '123456') => {
        const loginSuccessful = await login(username, plainPass);

        if (loginSuccessful) {
            setTimeout(() => {
                setLoading(false);
                navigate('/chat-page');
            }, 1000);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <Header/>

            <div className="overflow-x-auto mt-3">
                <table className="min-w-full border border-gray-300">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Username</th>
                        <th className="py-2 px-4 border-b">Full name</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.username}>
                            <td className="py-2 px-4 border-b">{user.username}</td>
                            <td className="py-2 px-4 border-b">{user.fullName}</td>
                            <td className="py-2 px-4 border-b">{user.email}</td>
                            <td className="py-2 px-4 border-b">
                                <LoadingButton
                                    content={'Login'}
                                    onClick={() => onLoginForEachItem(user.username)}
                                    isLoading={isLoading}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TestAccountPage;