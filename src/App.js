import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from './component/LoginPage/LoginPage';
import ChatPage from './component/ChatPage/ChatPage';
import RegisterPage from "./component/LoginPage/RegisterPage";
import AddPrivateConversationPage from "./component/AddPrivateConversationPage/AddPrivateConversationPage";
import AddGroupPage from "./component/AddGroupPage/AddGroupPage";
import ForgotPasswordPage from "./component/LoginPage/ForgotPasswordPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/chat-page" element={<ChatPage />} />
                <Route path="/add-private-conversation" element={<AddPrivateConversationPage />} />
                <Route path="/add-group" element={<AddGroupPage />} />
                <Route
                    index
                    element={<Navigate to="/login" replace />}
                />
            </Routes>
        </Router>
    );
}

export default App;
