import React, { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme,
    IconButton,
    Box,
    AppBar,
    Toolbar,
    Button,
    Typography
} from '@mui/material';
import { Store, Inventory, GridView, BarChart, Menu as MenuIcon } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import logo from "../images/logo.svg";
import { useAuth0 } from '@auth0/auth0-react';

interface MenuItem {
    label: string;
    icon: React.ReactElement;
    path: string;
}

const menuItems: MenuItem[] = [
    { label: 'Stores', icon: <Store />, path: '/stores' },
    { label: 'SKUs', icon: <Inventory />, path: '/skus' },
    { label: 'Planning', icon: <GridView />, path: '/planning' },
    { label: 'Charts', icon: <BarChart />, path: '/charts' },
    { label: 'grossMargin', icon: <BarChart />, path: '/gross' }
];

const SideNavBar: React.FC = () => {
        const { loginWithRedirect, logout, isAuthenticated, user, error, isLoading } = useAuth0();
        const isMobile = useMediaQuery('(max-width:600px)');
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
    const [open, setOpen] = useState(false);
 
    const location = useLocation();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };


    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: theme.zIndex.drawer + 1,
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <img
                            src={logo}
                            alt="logo"
                            style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {isAuthenticated ? (
                            <>
                                <Typography variant="body1" noWrap sx={{ color: '#333' }}>
                                    Welcome, {user?.name || 'User'}
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#81C784',
                                        color: '#FFFFFF',
                                        '&:hover': { backgroundColor: '#66BB6A' }
                                    }}
                                    onClick={logout}
                                >
                                    Log Out
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#90CAF9',
                                    color: '#FFFFFF',
                                    '&:hover': { backgroundColor: '#42A5F5' }
                                }}
                                onClick={loginWithRedirect}
                            >
                                Log In
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant={isLargeScreen ? 'permanent' : 'temporary'}
                open={isLargeScreen ? true : open}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                anchor="left"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        bgcolor: '#f5f5f5',
                        top: 0
                    }
                }}
            >
                <List>
                    {menuItems.map(({ label, icon, path }) => (
                        <ListItem key={label} component={Link} to={path} disablePadding sx={{ mt: 6}}>
                            <ListItemButton selected={location.pathname === path}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {!isLargeScreen && <Box sx={{ height: 64 }} />}
        </>
    );
};

export default SideNavBar;
