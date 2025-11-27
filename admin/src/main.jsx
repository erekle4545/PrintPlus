import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './css/index.css'
import { Provider } from './store/context/context'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider>
            <BrowserRouter>
                <>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 5000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                                padding: '16px',
                            },
                            success: {
                                duration: 3000,
                                style: {
                                    background: '#4caf50',
                                },
                                iconTheme: {
                                    primary: '#fff',
                                    secondary: '#4caf50',
                                },
                            },
                            error: {
                                duration: 5000,
                                style: {
                                    background: '#f44336',
                                },
                                iconTheme: {
                                    primary: '#fff',
                                    secondary: '#f44336',
                                },
                            },
                        }}
                    />

                    <App />
                </>
            </BrowserRouter>
        </Provider>
    </StrictMode>
)
