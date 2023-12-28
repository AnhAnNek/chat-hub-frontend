import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import ChatPage from './components/ChatPage/ChatPage';
import RegisterPage from "./components/LoginPage/RegisterPage";
import AddPrivateConversationPage from "./components/AddPrivateConversationPage/AddPrivateConversationPage";
import AddGroupPage from "./components/AddGroupPage/AddGroupPage";
import ForgotPasswordPage from "./components/LoginPage/ForgotPasswordPage";
import Error404Page from "./components/Error404Page";
import TestAccountPage from "./components/LoginPage/TestAccountPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/chat-page" element={<ChatPage />} />
                <Route path="/add-private-conversation-page" element={<AddPrivateConversationPage />} />
                <Route path="/add-group-page" element={<AddGroupPage />} />
                <Route path="/accouts" element={<TestAccountPage />} />
                <Route
                    index
                    element={<Navigate to="/login" replace />}
                />

                <Route path="*" element={<Error404Page />}/>
            </Routes>
        </Router>
    );
}

export default App;
