import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const [token, setToken] = useState(
        localStorage.getItem('token')
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/me');

                setUser(response.data);
            } catch (error) {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/login', {
            email,
            password,
        });

        const newToken = response.data.token;

        localStorage.setItem('token', newToken);
        setToken(newToken);

        setUser(response.data.user);

        return response.data;
    };

    const register = async (
        name,
        email,
        password,
        password_confirmation
    ) => {
        const response = await api.post('/register', {
            name,
            email,
            password,
            password_confirmation,
        });

        return response.data;
    };

    const logout = async () => {
        try {
            if (token) {
                await api.post('/logout');
            }
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}