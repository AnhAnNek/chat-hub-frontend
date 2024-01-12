import {useEffect, useState} from "react";
import LoadingButton from "./LoadingButton";
import {useNavigate} from "react-router-dom";
import Header from "../Header";
import AuthService from "../../api/authService";
import UserService from "../../api/userService";
import {useAuth} from "../../contexts/AuthContext";

const TestAccountPage = () => {
    const navigate = useNavigate();

    const Auth = useAuth();

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const users = await UserService.getAll();
            setUsers(users);
        } catch (error) {
            console.log(error);
        }
    }

    const onLoginForEachItem = async (username, plainPass = '123456') => {
        try {
            const auth = await AuthService.login(username, plainPass);

            Auth.userLogin(auth);
            navigate('/chat-page');
        } catch (err) {
            console.error(err.message);
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
                                    isLoading={false}
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