import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { createGrid, GridOptions } from "ag-grid-community";

import { ColDef } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { Button, Box, Grid, Typography } from '@mui/material';

import "../style/planning.css";

import {
  AllEnterpriseModule,
  LicenseManager,
  ModuleRegistry,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllEnterpriseModule]);


interface RowData {
  Store: string;
  SKU: string;
  Price: number;
  Cost: number;
  SalesUnits: number;
  SalesDollars: number;
  gmDollars: number;
  gmPercent: number;
  Date: number;
  dateAdded: string;
  priceChange: string; // Track price change status (Increase/Decrease/No Change)
  week: number; // Track the week number
}

const PlanningScreen: React.FC = () => {
  const skus: { Store: string; SKU: string; Price?: number; Cost?: number; SalesUnits: number; Date: number; dateAdded: string }[] =
    JSON.parse(localStorage.getItem('skus') || '[]');
  const [rowData, setRowData] = useState<RowData[]>([]);

  useEffect(() => {
    const data: RowData[] = skus.map((sku) => ({
      Store: sku.Store,
      SKU: sku.SKU,
      Price: sku.Price ?? 0,
      Cost: sku.Cost ?? 0,
      SalesUnits: sku.SalesUnits || 0,
      SalesDollars: sku.SalesUnits * (sku.Price ?? 0),
      gmDollars: (sku.SalesUnits * (sku.Price ?? 0)) - (sku.SalesUnits * (sku.Cost ?? 0)),
      gmPercent: (sku.Price && sku.Cost) ? (((sku.Price - sku.Cost) / sku.Price) * 100) : 0,
      Date: sku.Date,
      dateAdded: sku.dateAdded,
      priceChange: 'No Change', 
      week: getWeekNumber(new Date(sku.dateAdded)), 
    }));

    const groupedByWeek = data.reduce((acc, row) => {
      if (!acc[row.week]) acc[row.week] = [];
      acc[row.week].push(row);
      return acc;
    }, {} as Record<number, RowData[]>);

    const allRows = Object.values(groupedByWeek).flat().map((row, index, arr) => {
      if (index > 0) {
        const prevRow = arr[index - 1];
        if (row.Price > prevRow.Price) {
          row.priceChange = 'Increase';
        } else if (row.Price < prevRow.Price) {
          row.priceChange = 'Decrease';
        } else {
          row.priceChange = 'No Change';
        }
      } else {
        row.priceChange = 'No Change'; 
      }
      return row;
    });

    setRowData(allRows);
  }, []);

  const getWeekNumber = (date: Date): number => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + 1) / 7);
  };

  const getPriceChangeColumnStyle = (params: any) => {
    const value = params.data.priceChange;
    if (value === 'Increase') {
      return 'price-change-increase';
    } else if (value === 'Decrease') {
      return 'price-change-decrease';
    } else {
      return 'price-change-no-change';
    }
  };

  const calculateFields = useCallback((params: any) => {
    const updatedData = rowData.map((row) => {
      if (row.SKU === params.data.SKU) {
        const SalesUnits = Number(row.SalesUnits) || 0;
        const Price = Number(row.Price) || 0;
        const Cost = Number(row.Cost) || 0;

        if (SalesUnits < 0 || Price < 0 || Cost < 0) {
          alert('Values cannot be negative');
          return row;
        }

        const SalesDollars = SalesUnits * Price;
        const gmDollars = SalesDollars - (SalesUnits * Cost);
        const gmPercent = SalesDollars ? (gmDollars / SalesDollars) * 100 : 0;

        return { ...row, SalesDollars, gmDollars, gmPercent };
      }
      return row;
    });
    setRowData(updatedData);
  }, [rowData]);

  const saveToLocalStorage = () => {
    localStorage.setItem('skus', JSON.stringify(rowData));
    alert('Data saved successfully!');
  };

  const exportToCSV = () => {
    const headers = colDefs.map((col) => col.headerName).join(',');
    const rows = rowData.map((row) => Object.values(row).join(',')).join('\n');

    const csvContent = headers + '\n' + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'planning_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [colDefs] = useState<ColDef[]>([
    { field: 'Store', headerName: 'Store', filter: true },
    { field: 'SKU', headerName: 'SKU', filter: true },
    { field: 'Price', headerName: 'Price', editable: true, cellEditor: 'agNumberCellEditor', valueFormatter: ({ value }) => `$${(value || 0).toFixed(2)}`, filter: true },
    { field: 'Cost', headerName: 'Cost', editable: true, cellEditor: 'agNumberCellEditor', valueFormatter: ({ value }) => `$${(value || 0).toFixed(2)}`, filter: true },
    { field: 'SalesUnits', headerName: 'Sales Units', editable: true, cellEditor: 'agNumberCellEditor', filter: true },
    { field: 'SalesDollars', headerName: 'Sales Dollars', valueFormatter: ({ value }) => `$${(value || 0).toFixed(2)}`, filter: true },
    { field: 'gmDollars', headerName: 'GM Dollars', valueFormatter: ({ value }) => `$${(value || 0).toFixed(2)}`, filter: true },
    { field: 'gmPercent', headerName: 'GM %', valueFormatter: ({ value }) => `${(value || 0).toFixed(2)}%`, filter: true },
    { field: 'priceChange', headerName: 'Price Change', cellClass: getPriceChangeColumnStyle, filter: true }
  ]);

  return (
    <Box p={4}>
    <Typography variant="h4" gutterBottom>
      Planning Screen
    </Typography>
    <Grid container spacing={2} mb={2} justifyContent="center">
      <Grid item>
        <Button variant="contained" color="primary">
          Export to CSV
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="secondary">
          Save to Local Storage
        </Button>
      </Grid>
    </Grid>
    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={{ flex: 1, minWidth: 100, sortable: true, filter: true }}
        pagination={true}
        paginationPageSize={10}
        rowSelection="multiple"
        animateRows={true}
        modules={[ClientSideRowModelModule]}
        onCellValueChanged={calculateFields}
      />
    </div>
  </Box>
  );
};

export default PlanningScreen;
