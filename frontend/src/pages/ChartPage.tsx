import React, { useEffect, useState } from 'react';
import { AgChartOptions, AgCharts } from 'ag-charts-community';
import { Paper, Typography, Box, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import * as XLSX from 'xlsx'; // Import the xlsx package for reading Excel files

// Function to read Excel file and process data
const readExcelFile = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0]; // Get the first sheet (adjust if necessary)
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    return jsonData;
};

const ChartPage: React.FC = () => {
    const [selectedStore, setSelectedStore] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>(''); // Default date
    const [chartData, setChartData] = useState<any[]>([]);
    const [excelData, setExcelData] = useState<any[]>([]); // Store the parsed Excel data

    // Handle file upload and process the Excel file
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const data = await readExcelFile(file);
        setExcelData(data);

        // Save data to localStorage for later usage
        localStorage.setItem('skus', JSON.stringify(data));
        alert('Excel data loaded into localStorage!');
    };

    // Filter data based on selectedStore and selectedDate
    useEffect(() => {
        const skus = excelData.length ? excelData : JSON.parse(localStorage.getItem('skus') || '[]');
        if (!selectedStore || !selectedDate) return; // Avoid processing if no store or date is selected

        // Filter skus by dateAdded
        const filteredSkus = skus.filter((sku: any) => sku.dateAdded === selectedDate);

        const storeData = filteredSkus.reduce((acc: any, sku: any) => {
            if (!acc[sku.store]) {
                acc[sku.store] = { gmDollars: 0, salesDollars: 0 };
            }
            acc[sku.store].gmDollars += sku.salesUnits * (sku.price - sku.cost);
            acc[sku.store].salesDollars += sku.salesUnits * sku.price;
            return acc;
        }, {});

        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const filteredData = weeks.map(week => ({
            week,
            gmDollars: storeData[selectedStore]?.gmDollars || 0,
            gmPercent: storeData[selectedStore]?.salesDollars ? 
                (storeData[selectedStore].gmDollars / storeData[selectedStore].salesDollars) * 100 : 0
        }));
        setChartData(filteredData);
    }, [selectedStore, selectedDate, excelData]); // Dependencies are selectedStore, selectedDate, and excelData

    // Initialize chart when chartData changes
    useEffect(() => {
        if (chartData.length === 0) return; // Avoid rendering the chart if there is no data

        const options: AgChartOptions = {
            container: document.getElementById('myChart'),
            data: chartData,
            series: [
                { type: 'bar', xKey: 'week', yKey: 'gmDollars', yName: 'GM Dollars' },
                { type: 'line', xKey: 'week', yKey: 'gmPercent', yName: 'GM %', yAxis: { position: 'right' } }
            ],
            title: { text: 'GM Dollars and GM % by Week', fontSize: 18 }
        };

        const chart = AgCharts.create(options);
        return () => {
            chart.destroy();
        };
    }, [chartData]); // Trigger chart rendering when chartData changes

    // Get unique stores and dates from localStorage or uploaded Excel data
    const skus = excelData.length ? excelData : JSON.parse(localStorage.getItem('skus') || '[]');
    const stores = skus.map((sku: any) => sku.store)
        .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
    const dates = skus.map((sku: any) => sku.dateAdded)
        .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Sales Chart
            </Typography>

            {/* Button to Import Sample Data */}
            <Button variant="contained" component="label" sx={{ mb: 2 }}>
                Import Excel Data
                <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
            </Button>

            {/* Store Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Store</InputLabel>
                <Select
                    value={selectedStore}
                    label="Select Store"
                    onChange={(e) => setSelectedStore(e.target.value)}
                >
                    {stores.map((store: string) => (
                        <MenuItem key={store} value={store}>{store}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Date Selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Date</InputLabel>
                <Select
                    value={selectedDate}
                    label="Select Date"
                    onChange={(e) => setSelectedDate(e.target.value)}
                >
                    {dates.map((date: string) => (
                        <MenuItem key={date} value={date}>{date}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Chart */}
            <Box id="myChart" sx={{ height: '500px', width: '100%' }} />
        </Paper>
    );
};

export default ChartPage;
