import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth0 } from '@auth0/auth0-react';
import logo from "../images/download.jpg"

const Header: React.FC = () => {
    const { loginWithRedirect, logout, isAuthenticated, user, error, isLoading } = useAuth0();
    const isMobile = useMediaQuery('(max-width:600px)');

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Authentication Error: {error.message}</p>;

    return (
        <AppBar position="fixed" sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: '#1A237E',
            color: '#FFFFFF',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Mobile menu icon *

                {/* Center the logo */}
                <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
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

                {/* Auth button (Login/Logout) */}
                {isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1" noWrap>
                            Welcome, {user?.name || 'User'}
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#FF6F00',
                                color: '#FFFFFF',
                                '&:hover': {
                                    backgroundColor: '#E65100',
                                }
                            }}
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                        >
                            Log Out
                        </Button>
                    </Box>
                ) : (
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#43A047',
                            color: '#FFFFFF',
                            '&:hover': {
                                backgroundColor: '#2E7D32',
                            }
                        }}
                        onClick={() => loginWithRedirect()}
                    >
                        Log In
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
