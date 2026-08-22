import { Route, Routes } from 'react-router-dom'
import Site from './components/Site'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Site />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
