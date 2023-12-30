import React from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import ChatPage from './components/ChatPage/ChatPage';
import RegisterPage from "./components/LoginPage/RegisterPage";
import AddPrivateConversationPage from "./components/AddPrivateConversationPage/AddPrivateConversationPage";
import AddGroupPage from "./components/AddGroupPage/AddGroupPage";
import ForgotPasswordPage from "./components/LoginPage/ForgotPasswordPage";
import Error404Page from "./components/Error404Page";
import TestAccountPage from "./components/LoginPage/TestAccountPage";
import {AuthProvider} from "./contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    <Route path="/chat-page" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
                    <Route path="/add-private-conversation-page" element={<PrivateRoute><AddPrivateConversationPage /></PrivateRoute>} />
                    <Route path="/add-group-page" element={<PrivateRoute><AddGroupPage /></PrivateRoute>} />
                    <Route path="/accouts" element={<TestAccountPage />} />
                    <Route
                        index
                        element={<Navigate to="/login" replace />}
                    />

                    <Route path="*" element={<Error404Page />}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
