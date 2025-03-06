import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';

const AddDimensionPage1 = () => {
    const [dimension, setDimension] = useState('');

    const handleSubmit = () => {
        console.log('Dimension Added:', dimension);
        setDimension('');
    };

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Add Dimension</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField 
                    label="Dimension Name" 
                    value={dimension} 
                    onChange={(e) => setDimension(e.target.value)} 
                    fullWidth 
                />
                <Button variant="contained" color="primary" onClick={handleSubmit}>Add Dimension</Button>
            </Box>
        </Paper>
    );
};

export default AddDimensionPage1;
