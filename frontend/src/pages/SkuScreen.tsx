import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, List, ListItem, ListItemText, IconButton,
    Typography, Paper, MenuItem, Divider
} from '@mui/material';
import { Delete } from '@mui/icons-material';

interface SKU {
    id: string;
    store: string;
    sku: string;
    price: number;
    cost: number;
    salesUnits: number;
    salesDollars: number;
    gmDollars: number;
    gmPercent: number;
    dateAdded: string; // Ensure this field is included for the date
}

const SKUManager: React.FC = () => {
    // State Initialization with LocalStorage fallback
    const [skus, setSkus] = useState<SKU[]>(() => {
        const storedSKUs = localStorage.getItem('skus');
        return storedSKUs ? JSON.parse(storedSKUs) : [];
    });

    const [storeOptions, setStoreOptions] = useState<string[]>(() => {
        const storedStores = localStorage.getItem('stores');
        return storedStores ? JSON.parse(storedStores) : [];
    });

    const [store, setStore] = useState('');
    const [sku, setSku] = useState('');
    const [skuPrice, setSkuPrice] = useState<string>('');
    const [skuCost, setSkuCost] = useState<string>('');
    const [salesUnits, setSalesUnits] = useState<string>('');

    // Update LocalStorage whenever SKUs change
    useEffect(() => {
        if (skus.length > 0) {
            localStorage.setItem('skus', JSON.stringify(skus));
        }
    }, [skus]);

    // Add a new SKU
    const addSKU = () => {
        if (store && sku && skuPrice && skuCost && salesUnits) {
            const price = parseFloat(skuPrice);
            const cost = parseFloat(skuCost);
            const salesUnitsNum = parseFloat(salesUnits);

            // Validate if the values are numbers before proceeding
            if (isNaN(price) || isNaN(cost) || isNaN(salesUnitsNum)) {
                alert('Please ensure all fields are valid numbers.');
                return;
            }

            const salesDollars = salesUnitsNum * price;
            const gmDollars = salesDollars - (salesUnitsNum * cost);
            const gmPercent = salesDollars > 0 ? (gmDollars / salesDollars) * 100 : 0;

            const newSKU: SKU = {
                id: Date.now().toString(),
                store,
                sku,
                price,
                cost,
                salesUnits: salesUnitsNum,
                salesDollars,
                gmDollars,
                gmPercent,
                dateAdded: new Date().toLocaleDateString(), // Automatically adds current date
            };

            setSkus((prev) => [...prev, newSKU]);
            localStorage.setItem('skus', JSON.stringify([...skus, newSKU]));
            resetFormFields();
        }
    };

    // Remove an SKU
    const removeSKU = (id: string) => {
        const updatedSkus = skus.filter((sku) => sku.id !== id);
        setSkus(updatedSkus);
        localStorage.setItem('skus', JSON.stringify(updatedSkus));
    };

    // Reset input fields
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
                    value={store}
                    onChange={(e) => setStore(e.target.value)}
                    sx={{ minWidth: 120 }}
                >
                    {storeOptions.map((storeOption) => (
                        <MenuItem key={storeOption} value={storeOption}>
                            {storeOption}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="SKU"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                />

                <TextField
                    type="number"
                    label="Price"
                    value={skuPrice}
                    onChange={(e) => setSkuPrice(e.target.value)}
                />

                <TextField
                    type="number"
                    label="Cost"
                    value={skuCost}
                    onChange={(e) => setSkuCost(e.target.value)}
                />

                <TextField
                    type="number"
                    label="Sales Units"
                    value={salesUnits}
                    onChange={(e) => setSalesUnits(e.target.value)}
                />

                <Button
                    variant="contained"
                    onClick={addSKU}
                    disabled={!store || !sku || !skuPrice || !skuCost || !salesUnits}
                >
                    Add SKU
                </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <List>
                {skus.map((sku) => (
                    <ListItem
                        key={sku.id}
                        secondaryAction={
                            <IconButton edge="end" onClick={() => removeSKU(sku.id)}>
                                <Delete />
                            </IconButton>
                        }
                    >
                        <ListItemText
                            primary={`Store: ${sku.store}, SKU: ${sku.sku}`}
                            secondary={`Price: $${sku.price?.toFixed(2) || '0.00'}, Cost: $${sku.cost?.toFixed(2) || '0.00'}, Sales Units: ${sku.salesUnits}, Sales Dollars: $${sku.salesDollars?.toFixed(2) || '0.00'}, GM$: $${sku.gmDollars?.toFixed(2) || '0.00'}, GM%: ${sku.gmPercent?.toFixed(2) || '0.00'}%, Date Added: ${sku.dateAdded}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default SKUManager;
