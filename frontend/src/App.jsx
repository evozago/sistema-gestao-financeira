import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import NotasFiscais from '@/pages/NotasFiscais'
import ContasPagar from '@/pages/ContasPagar'
import OCR from '@/pages/OCR'
import DRE from '@/pages/DRE'
import Configuracoes from '@/pages/Configuracoes'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/notas-fiscais" element={<NotasFiscais />} />
            <Route path="/contas-pagar" element={<ContasPagar />} />
            <Route path="/ocr" element={<OCR />} />
            <Route path="/dre" element={<DRE />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </Layout>
        <Toaster />
      </div>
    </Router>
  )
}

export default App

