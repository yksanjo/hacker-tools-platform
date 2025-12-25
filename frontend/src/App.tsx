import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ToolDetail from './pages/ToolDetail'
import SubmitTool from './pages/SubmitTool'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-hacker-dark">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tool/:id" element={<ToolDetail />} />
            <Route path="/submit" element={<SubmitTool />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App


