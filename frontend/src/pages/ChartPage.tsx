import React, { useEffect, useState } from 'react';
import { AgChartOptions, AgCharts } from 'ag-charts-community';
import {
    Paper,
    Typography,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
} from '@mui/material';
import * as XLSX from 'xlsx';

// Function to read Excel file and process data with the current date
const readExcelFile = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Add current date to each item
    const currentDate = new Date().toISOString().split('T')[0];
    return jsonData.map((item: any) => ({ ...item, dateAdded: currentDate }));
};

const ChartPage: React.FC = () => {
    const [selectedStore, setSelectedStore] = useState<string>('');
    const [chartData, setChartData] = useState<any[]>([]);
    const [excelData, setExcelData] = useState<any[]>([]);

    // Handle file upload and process the Excel file
    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const newData = await readExcelFile(file);
        const existingData = JSON.parse(localStorage.getItem('skus') || '[]');
        const combinedData = [...existingData, ...newData];

        setExcelData(combinedData);
        localStorage.setItem('skus', JSON.stringify(combinedData));
        alert('New Excel data merged with existing data in localStorage!');
    };

    useEffect(() => {
        const skus = excelData.length
            ? excelData
            : JSON.parse(localStorage.getItem('skus') || '[]');
        if (!selectedStore) return;

        // Get the most recent date from the data
        const latestDate = skus
            .map((sku: any) => sku.dateAdded)
            .sort()
            .pop();

        const filteredSkus = skus.filter(
            (sku: any) =>
                sku.Store === selectedStore && sku.dateAdded === latestDate
        );

        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const storeData = weeks.map((week, index) => {
            const weeklyData = filteredSkus.filter(
                (sku: any, i: number) =>
                    Math.floor((i / filteredSkus.length) * 4) === index
            );

            const salesPrice = weeklyData.reduce(
                (acc: number, sku: any) =>
                    acc + (sku.SalesUnits * sku.Price || 0),
                0
            );
            const costPrice = weeklyData.reduce(
                (acc: number, sku: any) =>
                    acc + (sku.SalesUnits * sku.Cost || 0),
                0
            );
            const profit = salesPrice - costPrice;
            const loss = profit < 0 ? profit : 0;

            return {
                week,
                salesPrice,
                costPrice,
                profit: profit > 0 ? profit : 0,
                loss: Math.abs(loss),
            };
        });

        setChartData(storeData);
    }, [selectedStore, excelData]);

    useEffect(() => {
        if (chartData.length === 0) return;

        const options: AgChartOptions = {
            container: document.getElementById('myChart'),
            data: chartData,
            series: [
                {
                    type: 'bar',
                    xKey: 'week',
                    yKey: 'salesPrice',
                    yName: 'Sales Price (SP)',
                    fill: '#42a5f5',
                    label: {
                        enabled: true,
                        color: '#42a5f5',
                        formatter: ({ value }) => `$${value.toFixed(2)}`,
                    },
                },
                {
                    type: 'bar',
                    xKey: 'week',
                    yKey: 'costPrice',
                    yName: 'Cost Price (CP)',
                    fill: '#66bb6a',
                    label: {
                        enabled: true,
                        color: '#66bb6a',
                        formatter: ({ value }) => `$${value.toFixed(2)}`,
                    },
                },
                {
                    type: 'bar',
                    xKey: 'week',
                    yKey: 'profit',
                    yName: 'Profit',
                    fill: '#ff7043',
                    label: {
                        enabled: true,
                        color: '#ff7043',
                        formatter: ({ value }) => `$${value.toFixed(2)}`,
                    },
                },
                {
                    type: 'bar',
                    xKey: 'week',
                    yKey: 'loss',
                    yName: 'Loss',
                    fill: '#f44336',
                    label: {
                        enabled: true,
                        color: '#f44336',
                        formatter: ({ value }) => `-$${value.toFixed(2)}`,
                    },
                    yKeyNegative: 'loss',
                },
            ],
            title: { text: 'SP, CP, Profit, and Loss by Week', fontSize: 18 },
            legend: { position: 'bottom' },
        };

        const chart = AgCharts.create(options);
        return () => {
            chart.destroy();
        };
    }, [chartData]);

    const skus = excelData.length
        ? excelData
        : JSON.parse(localStorage.getItem('skus') || '[]');
    const stores = Array.from(new Set(skus.map((sku: any) => sku.Store)));

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Sales, Cost, Profit, and Loss Chart
            </Typography>

            <Button variant="contained" component="label" sx={{ mb: 2 }}>
                Import Excel Data
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    hidden
                    onChange={handleFileUpload}
                />
            </Button>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Store</InputLabel>
                <Select
                    value={selectedStore}
                    label="Select Store"
                    onChange={(e) => setSelectedStore(e.target.value)}
                >
                    {stores.map((Store: string) => (
                        <MenuItem key={Store} value={Store}>
                            {Store}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box id="myChart" sx={{ height: '500px', width: '100%' }} />
        </Paper>
    );
};

export default ChartPage;