// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f44336',
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
    },
});

export default theme;
