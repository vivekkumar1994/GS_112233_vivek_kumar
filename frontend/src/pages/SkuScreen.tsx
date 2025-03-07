import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Typography, Paper, MenuItem, Divider,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

interface SKU {
    id: string;
    Store: string;
    SKU: string;
    Price: number;
    Cost: number;
    SalesUnits: number;
    salesDollars: number;
    gmDollars: number;
    gmPercent: number;
    dateAdded: string;
}

const SKUManager: React.FC = () => {
    const [skus, setSkus] = useState<SKU[]>(() => {
        const storedSKUs = localStorage.getItem('skus');
        return storedSKUs ? JSON.parse(storedSKUs) : [];
    });

    const [storeOptions, setStoreOptions] = useState<string[]>(() => {
        const storedStores = localStorage.getItem('stores');
        return storedStores ? JSON.parse(storedStores) : [];
    });

    const [Store, setStore] = useState('');
    const [SKU, setSku] = useState('');
    const [skuPrice, setSkuPrice] = useState('');
    const [skuCost, setSkuCost] = useState('');
    const [SalesUnits, setSalesUnits] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('skus', JSON.stringify(skus));
    }, [skus]);

    const addOrUpdateSKU = () => {
        if (Store && SKU && skuPrice && skuCost && SalesUnits) {
            const Price = parseFloat(skuPrice) || 0;
            const Cost = parseFloat(skuCost) || 0;
            const salesUnitsNum = parseFloat(SalesUnits) || 0;

            if (isNaN(Price) || isNaN(Cost) || isNaN(salesUnitsNum)) {
                alert('Please ensure all fields are valid numbers.');
                return;
            }

            const salesDollars = salesUnitsNum * Price;
            const gmDollars = salesDollars - (salesUnitsNum * Cost);
            const gmPercent = salesDollars > 0 ? (gmDollars / salesDollars) * 100 : 0;

            const newSKU: SKU = {
                id: editingId || Date.now().toString(),
                Store,
                SKU,
                Price,
                Cost,
                SalesUnits: salesUnitsNum,
                salesDollars,
                gmDollars,
                gmPercent,
                dateAdded: new Date().toLocaleDateString(),
            };

            if (editingId) {
                setSkus((prev) => prev.map((item) => (item.id === editingId ? newSKU : item)));
                setEditingId(null);
            } else {
                setSkus((prev) => [...prev, newSKU]);
            }

            resetFormFields();
        } else {
            alert('Please fill out all fields.');
        }
    };

    const removeSKU = (id: string) => {
        const updatedSkus = skus.filter((sku) => sku.id !== id);
        setSkus(updatedSkus);
    };
    const editSKU = (sku: SKU) => {
        console.log('Editing SKU:', sku); // Debugging line
        setStoreOptions((prevOptions) => {
            if (!prevOptions.includes(sku.Store)) {
                return [...prevOptions, sku.Store];
            }
            return prevOptions;
        });
    
        setStore(sku.Store ?? '');
        setSku(sku.SKU ?? '');
        setSkuPrice((sku.Price ?? '').toString());
        setSkuCost((sku.Cost ?? '').toString());
        setSalesUnits((sku.SalesUnits ?? '').toString());
        setEditingId(sku.id);
    };

    const resetFormFields = () => {
        setStore('');
        setSku('');
        setSkuPrice('');
        setSkuCost('');
        setSalesUnits('');
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, margin: '20px auto' }}>
            <Typography variant="h5" gutterBottom>
                SKU Management
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    select
                    label="Store"
                    value={Store}
                    onChange={(e) => setStore(e.target.value)}
                    sx={{ minWidth: 120 }}
                >
                    {storeOptions.map((storeOption) => (
                        <MenuItem key={storeOption} value={storeOption}>
                            {storeOption}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField label="SKU" value={SKU} onChange={(e) => setSku(e.target.value)} />
                <TextField type="number" label="Price" value={skuPrice} onChange={(e) => setSkuPrice(e.target.value)} />
                <TextField type="number" label="Cost" value={skuCost} onChange={(e) => setSkuCost(e.target.value)} />
                <TextField type="number" label="Sales Units" value={SalesUnits} onChange={(e) => setSalesUnits(e.target.value)} />

                <Button
                    variant="contained"
                    onClick={addOrUpdateSKU}
                    disabled={!Store || !SKU || !skuPrice || !skuCost || !SalesUnits}
                >
                    {editingId ? 'Update SKU' : 'Add SKU'}
                </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Store</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Cost</TableCell>
                            <TableCell>Sales Units</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {skus.map((sku) => (
                            <TableRow key={sku.id}>
                                <TableCell>{sku.Store}</TableCell>
                                <TableCell>{sku.SKU}</TableCell>
                                <TableCell>${(sku.Price ?? 0).toFixed(2)}</TableCell>
                                <TableCell>${(sku.Cost ?? 0).toFixed(2)}</TableCell>
                                <TableCell>{sku.SalesUnits ?? 0}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => editSKU(sku)}><Edit /></IconButton>
                                    <IconButton onClick={() => removeSKU(sku.id)}><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default SKUManager;
