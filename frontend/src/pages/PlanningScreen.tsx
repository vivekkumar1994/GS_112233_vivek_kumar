import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface RowData {
    Store: string;
    SKU: string;
    Price: number;
    Cost: number;
    SalesUnits: number;
    SalesDollars: number;
    gmDollars: number;
    gmPercent: number;
}

const PlanningScreen: React.FC = () => {
    const skus: { Store: string; SKU: string; Price?: number; Cost?: number; SalesUnits: number; salesDollars: number; gmDollars: number; gmPercent: number }[] = JSON.parse(localStorage.getItem('skus') || '[]');
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
            gmPercent: (sku.Price && sku.Cost) ? (((sku.Price - sku.Cost) / sku.Price) * 100) : 0
        }));
        setRowData(data);
    }, []);

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

    const getGMPercentCellStyle = (params: any) => {
        const value = Number(params.value) || 0;
        if (value >= 40) return { backgroundColor: 'green', color: 'white' };
        if (value >= 10) return { backgroundColor: 'yellow', color: 'black' };
        if (value > 5) return { backgroundColor: 'orange', color: 'black' };
        return { backgroundColor: 'red', color: 'white' };
    };

    const exportToCSV = () => {
        // Add column headers as the first row
        const headers = colDefs.map((col) => col.headerName).join(',');
        const rows = rowData.map((row) => Object.values(row).join(',')).join('\n');
    
        // Combine headers and rows into one CSV string
        const csvContent = headers + '\n' + rows;
    
        // Create a Blob and trigger the download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'planning_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [colDefs] = useState<ColDef[]>([
        { field: 'Store', headerName: 'Store' },
        { field: 'SKU', headerName: 'SKU' },
        { field: 'Price', headerName: 'Price', editable: true, cellEditor: 'agNumberCellEditor', valueFormatter: ({ value }) => `$${(value || 0).toFixed(2)}` },
        { field: 'Cost', headerName: 'Cost', editable: true, cellEditor: 'agNumberCellEditor', valueFormatter: ({ value }) => `$${(value || 0).toFixed(2)}` },
        { field: 'SalesUnits', headerName: 'Sales Units', editable: true, cellEditor: 'agNumberCellEditor' },
        { field: 'SalesDollars', headerName: 'Sales Dollars', valueFormatter: ({ value }) => `$${(value || 0).toFixed(2)}` },
        { field: 'gmDollars', headerName: 'GM Dollars', valueFormatter: ({ value }) => `$${(value || 0).toFixed(2)}` },
        { field: 'gmPercent', headerName: 'GM %', valueFormatter: ({ value }) => `${(value || 0).toFixed(2)}%`, cellStyle: getGMPercentCellStyle }
    ]);

    return (
        <div>
            <button onClick={exportToCSV} style={{ margin: '10px', padding: '5px 10px' }}>Export to CSV</button>
            <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={{ flex: 1, sortable: true, filter: true }}
                    rowSelection="single"
                    animateRows={true}
                    modules={[ClientSideRowModelModule]}
                    onCellValueChanged={calculateFields}
                />
            </div>
        </div>
    );
};

export default PlanningScreen;
