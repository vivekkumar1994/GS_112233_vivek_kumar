import React, { useState, useEffect } from 'react';
import { Button, TextField, Paper, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface Store {
    serialNo: string;
    Store: string;
    state: string;
    city: string;
}

const StoreScreen: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [newStoreName, setNewStoreName] = useState<string>('');
    const [newState, setNewState] = useState<string>('');
    const [newCity, setNewCity] = useState<string>('');
    const [serialCounter, setSerialCounter] = useState<number>(1); // Counter to generate serial numbers

    // Load from localStorage only on initial render
    useEffect(() => {
        const storedStores = localStorage.getItem('stores');
        if (storedStores) {
            try {
                const parsedStores = JSON.parse(storedStores);
                setStores(parsedStores);
                setSerialCounter(parsedStores.length + 1); // Update serialCounter based on stored data
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
        if (newStoreName.trim() && newState.trim() && newCity.trim()) {
            const newStore: Store = {
                serialNo: `SN-${serialCounter}`, // Automated serial number
                Store: newStoreName.trim(),
                state: newState.trim(),
                city: newCity.trim()
            };
            setStores([...stores, newStore]);
            setSerialCounter(serialCounter + 1); // Increment serial counter for next store
            setNewStoreName('');
            setNewState('');
            setNewCity('');
        }
    };

    const removeStore = (serialNo: string) => {
        const updatedStores = stores.filter((store) => store.serialNo !== serialNo);
        setStores(updatedStores);

        // Update localStorage immediately to reflect the change
        localStorage.setItem('stores', JSON.stringify(updatedStores));
    };

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
            <Typography variant="h5" gutterBottom>Store Management</Typography>
            <TextField
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                placeholder="Store Name"
                sx={{ mb: 2, mr: 2 }}
            />
            <TextField
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                placeholder="State"
                sx={{ mb: 2, mr: 2 }}
            />
            <TextField
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="City"
                sx={{ mb: 2 }}
            />
            <Button onClick={addStore} variant="contained" sx={{ ml: 2 }}>
                Add Store
            </Button>

            <TableContainer sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell>Serial Number</TableCell>
                            <TableCell>Store Name</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stores.map((store) => (
                            <TableRow key={store.serialNo}>
                                 <TableCell>{store.serialNo}</TableCell>
                                <TableCell>{store.Store}</TableCell>
                                <TableCell>{store.state}</TableCell>
                               
                                <TableCell>{store.city}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => removeStore(store.serialNo)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default StoreScreen;
