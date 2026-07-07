import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [cadet, setCadet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve active session from localStorage on reload
        const savedUser = localStorage.getItem('dtu_ncc_prod_user');
        const savedCadet = localStorage.getItem('dtu_ncc_prod_cadet');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        if (savedCadet) {
            setCadet(JSON.parse(savedCadet));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            setUser(data.user);
            setCadet(data.cadet);
            localStorage.setItem('dtu_ncc_prod_user', JSON.stringify(data.user));
            if (data.cadet) {
                localStorage.setItem('dtu_ncc_prod_cadet', JSON.stringify(data.cadet));
            } else {
                localStorage.removeItem('dtu_ncc_prod_cadet');
            }
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const logout = () => {
        setUser(null);
        setCadet(null);
        localStorage.removeItem('dtu_ncc_prod_user');
        localStorage.removeItem('dtu_ncc_prod_cadet');
    };

    return (
        <AuthContext.Provider value={{ user, cadet, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
