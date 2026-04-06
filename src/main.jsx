import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from './components/ui/provider'
import { Toaster } from './components/ui/toaster'
import './App.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider>
      <App />
      <Toaster />
    </Provider>
  </BrowserRouter>
)
