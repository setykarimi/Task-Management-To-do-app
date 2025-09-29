import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router'
import  router from './routes.ts'



createRoot(document.getElementById('root')!).render(
  <RouterProvider  router={router} />
)
