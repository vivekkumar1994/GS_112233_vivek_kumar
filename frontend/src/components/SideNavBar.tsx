import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme, IconButton, Box } from '@mui/material';
import { Store, Inventory, GridView, BarChart, Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

interface MenuItem {
    label: string;
    icon: React.ReactElement;
    path: string;
}

const menuItems: MenuItem[] = [
    { label: 'Stores', icon: <Store />, path: '/stores' },
    { label: 'SKUs', icon: <Inventory />, path: '/skus' },
    { label: 'Planning', icon: <GridView />, path: '/planning' },
    { label: 'Charts', icon: <BarChart />, path: '/charts' }
];

const SideNavBar: React.FC = () => {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('md')); // Check for medium and larger screens
    const [open, setOpen] = useState(false); // Track the open state of the drawer for small screens

    const handleDrawerToggle = () => {
        setOpen(!open); // Toggle the open state for small screens
    };

    return (
        <>
            {/* Hamburger menu for small screens */}
            {!isLargeScreen && (
                <IconButton
                    color="primary"
                    aria-label="open drawer"
                    onClick={handleDrawerToggle}
                    edge="start"
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16, // Position on the right side
                        zIndex: 1201, // Make sure it appears above the drawer
                    }}
                >
                    <MenuIcon />
                </IconButton>
            )}

            {/* Sidebar Drawer */}
            <Drawer
                variant={isLargeScreen ? "permanent" : "temporary"} // Permanent for large screens, temporary for small screens
                open={isLargeScreen ? true : open} // Open the drawer automatically on large screens or based on state for small screens
                onClose={!isLargeScreen ? handleDrawerToggle : undefined} // Handle close on small screens
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        mt: 8, // Apply margin-top to the drawer paper
                    },
                }}
            >
                <List>
                    {menuItems.map(({ label, icon, path }) => (
                        <ListItem key={label} component={Link} to={path} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

        
        </>
    );
};

export default SideNavBar;
