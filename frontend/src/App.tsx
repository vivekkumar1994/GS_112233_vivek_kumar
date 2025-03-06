// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import TopNavBar from "./components/Header.tsx"
import SideNavBar from './components/SideNavBar.tsx';
import StoreScreen from './pages/StoreScreen.tsx';
import SkuScreen from './pages/SkuScreen.tsx';
import PlanningScreen from './pages/PlanningScreen.tsx';
import ChartScreen from './pages/ChartPage.tsx';

const App: React.FC = () => (
    <Router>
    <CssBaseline />
    <TopNavBar />
    <Box sx={{ display: 'flex', mt: 10}}> {/* Add margin-top (mt) */}
        <SideNavBar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
                <Route path="/stores" element={<StoreScreen />} />
                <Route path="/skus" element={<SkuScreen />} />
                <Route path="/planning" element={<PlanningScreen />} />
                <Route path="/charts" element={<ChartScreen />} />
            </Routes>
        </Box>
    </Box>
</Router>
);

export default App;
