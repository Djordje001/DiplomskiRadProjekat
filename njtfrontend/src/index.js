import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createGlobalStyle } from 'styled-components';


//axios.defaults.baseURL="http://127.0.0.1:8080";
//axios.defaults.baseURL="http://192.168.1.5:8080";
axios.defaults.baseURL = "http://localhost:8080";


const GlobalStyle = createGlobalStyle`
  body {
     background-color: rgba(52, 152, 219, 0.2); /* Svetlija plava sa 20% providnosti */
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
  }
`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <BrowserRouter className="app">
     <GlobalStyle />
    <App />
    </BrowserRouter>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
