import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.tsx'
import './Main.scss'
import Register from './pages/register/Register.tsx'
import DefaultLayout from "./layout/Default.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <DefaultLayout>
              <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/register" element={<Register />} />
              </Routes>
          </DefaultLayout>
      </BrowserRouter>
  </StrictMode>,
)
