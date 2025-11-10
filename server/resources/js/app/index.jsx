import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import {BrowserRouter} from "react-router-dom";
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import { ReactQueryDevtools } from 'react-query/devtools'

import AlertTemplate from 'react-alert-template-basic';
import {Provider} from "./store/context/context";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

// optional configuration
const options = {
    // you can also just use 'bottom center'
    position: positions.BOTTOM_RIGHT,
    timeout: 5000,
    offset: '10px',

    // you can also just use 'scale'
    transition: transitions.SCALE
}


const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider>
                <AlertProvider template={AlertTemplate} {...options}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </AlertProvider>
            </Provider>
            {/* The rest of your application */}
            {/*<ReactQueryDevtools initialIsOpen={true} />*/}
        </QueryClientProvider>
    </React.StrictMode>,
);


