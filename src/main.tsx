import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.tsx'
import './Main.scss'
import Register from './pages/register/Register.tsx'
import DefaultLayout from "./layout/Default.tsx";
import CheckIn from "./pages/checkin/CheckIn.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <DefaultLayout>
              <Routes>
                  <Route path="/" element={<App />} />
                  <Route path="/register/:event_id" element={<Register />} />
                  <Route path="/check-in/:checkpoint_id" element={<CheckIn />} />
              </Routes>
          </DefaultLayout>
      </BrowserRouter>
  </StrictMode>,
)
