// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface ProtectedRouteProps {
    element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    if (isLoading) return <p>Loading...</p>;

    if (!isAuthenticated) {
        loginWithRedirect();
        return null; // Prevent rendering until redirection
    }

    return element;
};

export default ProtectedRoute;
