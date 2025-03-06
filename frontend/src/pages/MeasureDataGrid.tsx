// MeasureDataGrid.js
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const MeasureDataGrid = () => {
    const rowData = [
        { product: 'Product A', value: 120 },
        { product: 'Product B', value: 80 },
        { product: 'Product C', value: 200 }
    ];

    const columnDefs = [
        { field: 'product', headerName: 'Product Name', sortable: true, filter: true },
        { 
            field: 'value', 
            headerName: 'Value', 
            cellStyle: params => ({
                backgroundColor: params.value > 100 ? '#f44336' : '#4caf50',
                color: '#fff'
            })
        }
    ];

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
                rowData={rowData}
                // columnDefs={columnDefs}
                defaultColDef={{ sortable: true, filter: true }}
            />
        </div>
    );
};

export default MeasureDataGrid;
