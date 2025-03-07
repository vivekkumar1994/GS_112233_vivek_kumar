import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <Auth0Provider
        domain="dev-hon88oyxqdfrljz4.us.auth0.com"
        clientId="Rru6SctIEDMStNBOOTUBGGYbH5MjMMeu"
        authorizationParams={{
          redirect_uri: 'https://melodious-beignet-2955ad.netlify.app/'
        }}
      >
            <ThemeProvider theme={theme}>
   
    <App />
    </ThemeProvider>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
