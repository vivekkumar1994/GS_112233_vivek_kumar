// TopNavBar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const Header: React.FC = () => {
    const { loginWithRedirect, logout, isAuthenticated, user, error, isLoading } = useAuth0();

    // Loading and Error States
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Authentication Error: {error.message}</p>;

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                {/* Company Logo */}
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Company Logo
                </Typography>

                {/* Sign In / Sign Out Buttons */}
                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1">
                            Welcome, {user?.name || 'User'}
                        </Typography>
                        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                            Log Out
                        </button>
                    </Box>
                ) : (
                    <button onClick={() => loginWithRedirect()}>Log In</button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
