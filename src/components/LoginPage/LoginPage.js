import React, {useState} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import CustomModal from "../CustomModal";
import LoadingButton from "./LoadingButton";
import AuthService from "../../api/authService";
import {useAuth} from "../../contexts/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();

    const Auth = useAuth();
    const isAuthenticated = Auth.userIsAuthenticated();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = (errorMessage) => {
        setErrorMessage(errorMessage);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const onLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const auth = await AuthService.login(username, password);

            Auth.userLogin(auth);
            setTimeout(() => {
                setIsLoading(false);
                navigate('/chat-page');
            }, 1000);
        } catch (err) {
            setIsLoading(false);
            openModal(err.message);
        }
    };
    
    if (isAuthenticated) {
        return <Navigate to="/chat-page" />;
    }

    return (
        <div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Login to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                            Username
                        </label>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2 relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 px-2 flex items-center focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash}
                                                 className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <LoadingButton content={'Login'} onClick={onLogin} isLoading={isLoading} />

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <a href="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Register
                        </a>
                    </p>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        If you were a developer?{' '}
                        <a href="/accouts" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Accounts
                        </a>
                    </p>
                </div>
            </div>

            {isModalOpen && (
                <CustomModal
                    isError={true}
                    title={'Login Failed'}
                    message={errorMessage}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}

export default LoginPage;
