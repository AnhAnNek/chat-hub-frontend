import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from './component/LoginPage/LoginPage';
import ChatPage from './component/ChatPage/ChatPage';
import RegisterPage from "./component/LoginPage/RegisterPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/chat-page" element={<ChatPage />} />
                <Route
                    index
                    element={<Navigate to="/login" replace />}
                />
            </Routes>
        </Router>
    );
}

export default App;
