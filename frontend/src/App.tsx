// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import TopNavBar from './components/Header.tsx';
import SideNavBar from './components/SideNavBar.tsx';
import StoreScreen from './pages/StoreScreen.tsx';
import SkuScreen from './pages/SkuScreen.tsx';
import PlanningScreen from './pages/PlanningScreen.tsx';
import ChartScreen from './pages/ChartPage.tsx';
import ProtectedRoute from './middleware/ProtectedRoute.tsx'; // Import ProtectedRoute
import GrossMargin from "./pages/GrossMargin.tsx"

const App: React.FC = () => (
    <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex', mt: 10 }}>
            <SideNavBar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Routes>
                    <Route path="/stores" element={<ProtectedRoute element={<StoreScreen />} />} />
                    <Route path="/skus" element={<ProtectedRoute element={<SkuScreen />} />} />
                    <Route path="/planning" element={<ProtectedRoute element={<PlanningScreen />} />} />
                    <Route path="/charts" element={<ProtectedRoute element={<ChartScreen />} />} />
                    <Route path="/gross" element={<ProtectedRoute element={<GrossMargin/>} />} />
                </Routes>
            </Box>
        </Box>
    </Router>
);

export default App;
