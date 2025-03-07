import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth0 } from '@auth0/auth0-react';
import logo from "../images/logo.svg";

const Header: React.FC = () => {
    const { loginWithRedirect, logout, isAuthenticated, user, error, isLoading } = useAuth0();
    const isMobile = useMediaQuery('(max-width:600px)');

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Authentication Error: {error.message}</p>;

    return (
        <AppBar position="fixed" sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: '#f5f5f5', // Light background color for the AppBar
            color: '#333', // Dark text for contrast
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
           

                {/* Left-aligned logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <img 
                        src={logo} 
                        alt="logo" 
                        style={{
                            height: '40px', 
                            width: 'auto', 
                            objectFit: 'contain',
                        }} 
                    />
                </Box>

                {/* Right-side Auth button (Login/Logout) */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isAuthenticated ? (
                        <>
                            <Typography variant="body1" noWrap sx={{ color: '#333' }}>  {/* Dark text color */}
                                Welcome, {user?.name || 'User'}
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#81C784', // Lighter green color
                                    color: '#FFFFFF',
                                    '&:hover': {
                                        backgroundColor: '#66BB6A', // Darker green shade on hover
                                    }
                                }}
                                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                            >
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#90CAF9', // Light blue color
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#42A5F5', // Darker blue shade on hover
                                }
                            }}
                            onClick={() => loginWithRedirect()}
                        >
                            Log In
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
