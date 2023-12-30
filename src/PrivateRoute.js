import {useAuth} from "./contexts/AuthContext";
import {Navigate} from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { userIsAuthenticated } = useAuth();
    return userIsAuthenticated() ? children : <Navigate to="/login" />;
}

export default PrivateRoute;