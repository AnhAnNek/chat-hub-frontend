import {createContext, useContext, useEffect, useState} from "react";

const AUTH_STORAGE_KEY = "auth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    const getAuth = () => {
        return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    }

    const userIsAuthenticated = () => {
        let storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!storedAuth) {
            return false;
        }
        storedAuth = JSON.parse(storedAuth);

        const expInMilliseconds = storedAuth.exp * 1000;
        if (Date.now() > expInMilliseconds) {
            userLogout();
            return false;
        }
        return true;
    }

    const userLogin = (auth) => {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
        setAuth(auth);
    }

    const userLogout = () => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuth(null);
    }

    const contextValue = {
        auth,
        getAuth,
        userIsAuthenticated,
        userLogin,
        userLogout
    }

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
        setAuth(storedUser);
    }, []);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;

export function useAuth() {
    return useContext(AuthContext);
}

export { AuthProvider }

