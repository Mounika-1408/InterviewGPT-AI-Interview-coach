import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Interview from './pages/Interview'
import Results from './pages/Results'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1e2e',
            color: '#f0f6ff',
            border: '1px solid #1e3448',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px'
          }
        }}
      />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
