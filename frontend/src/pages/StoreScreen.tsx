import React, { useState, useEffect } from 'react';
import { List, ListItem, Button, TextField, Paper, Typography, IconButton, ListItemText } from '@mui/material';
import { Delete } from '@mui/icons-material';

const StoreScreen: React.FC = () => {
    const [stores, setStores] = useState<string[]>([]);
    const [newStore, setNewStore] = useState<string>('');

    // Load from localStorage only on initial render
    useEffect(() => {
        const storedStores = localStorage.getItem('stores');
        if (storedStores) {
            try {
                setStores(JSON.parse(storedStores));
            } catch (error) {
                console.error("Failed to parse stores from localStorage", error);
            }
        }
    }, []);

    // Save to localStorage when stores change
    useEffect(() => {
        if (stores.length > 0) { // Prevent saving an empty array on initial load
            localStorage.setItem('stores', JSON.stringify(stores));
        }
    }, [stores]);

    const addStore = () => {
        if (newStore.trim()) {
            setStores([...stores, newStore.trim()]);
            setNewStore('');
        }
    };

    const removeStore = (store: string) => {
        const updatedStores = stores.filter((s) => s !== store);
        setStores(updatedStores);
        
        // Update localStorage immediately to reflect the change
        localStorage.setItem('stores', JSON.stringify(updatedStores));
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
            <Typography variant="h5" gutterBottom>Store Management</Typography>
            <TextField
                value={newStore}
                onChange={(e) => setNewStore(e.target.value)}
                placeholder="Add Store"
            />
            <Button onClick={addStore} variant="contained" sx={{ ml: 2 }}>Add</Button>
            <List>
                {stores.map((store, index) => (
                    <ListItem key={index} secondaryAction={
                        <IconButton edge="end" onClick={() => removeStore(store)}>
                            <Delete />
                        </IconButton>
                    }>
                        <ListItemText primary={store} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default StoreScreen;
