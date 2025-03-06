import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface RowData {
    store: string;
    sku: string;
    price: number;
    cost: number;
    salesUnits: number;
    salesDollars: number;
    gmDollars: number;
    gmPercent: number;
}

const PlanningScreen: React.FC = () => {
    const skus: { store: string; sku: string; price?: number; cost?: number;salesUnits:number; 
        salesDollars:number ,gmDollars:number;gmPercent:number}[] = JSON.parse(localStorage.getItem('skus') || '[]');
    const [rowData, setRowData] = useState<RowData[]>([]);

    useEffect(() => {
        const data: RowData[] = skus.map((sku) => ({
            store: sku.store,
            sku: sku.sku,
            price: sku.price ?? 0,
            cost: sku.cost ?? 0,
            salesUnits: sku.salesUnits || 0,
            salesDollars:sku.salesDollars || 0,
            gmDollars:sku.gmDollars || 0,
            gmPercent:sku.gmPercent || 0,
        }));
        setRowData(data);
    }, []);

    const calculateFields = useCallback((params: any) => {
        const updatedData = rowData.map((row) => {
            if (row.sku === params.data.sku) {
                const salesUnits = Number(params.data.salesUnits) || 0;
                const price = Number(params.data.price) || 0;
                const cost = Number(params.data.cost) || 0;
                const salesDollars = salesUnits * price;
                const gmDollars = salesDollars - (salesUnits * cost);
                const gmPercent = salesDollars ? (gmDollars / salesDollars) * 100 : 0;
                return { ...row, salesUnits, salesDollars, gmDollars, gmPercent };
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

    const [colDefs] = useState<ColDef[]>([
        { field: 'store', headerName: 'Store' },
        { field: 'sku', headerName: 'SKU' },
        { field: 'price', headerName: 'Price', valueFormatter: ({ value }) => `$${(value || 0).toFixed(2)}` },
        { field: 'cost', headerName: 'Cost', valueFormatter: ({ value }) => `$${(value || 0).toFixed(2)}` },
        { field: 'salesUnits', headerName: 'Sales Units', editable: true, cellEditor: 'agNumberCellEditor' },
        { field: 'salesDollars', headerName: 'Sales Dollars', valueFormatter: ({ value }) => `$${(value || 0).toFixed(2)}` },
        { field: 'gmDollars', headerName: 'GM Dollars', valueFormatter: ({ value }) => `$${(value || 0).toFixed(2)}` },
        { field: 'gmPercent', headerName: 'GM %', valueFormatter: ({ value }) => `${(value || 0).toFixed(2)}%`, cellStyle: getGMPercentCellStyle }
    ]);

    return (
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
    );
};

export default PlanningScreen;
