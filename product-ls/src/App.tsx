import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AutocompleteSearch from './components/AutocompleteSearch'

function App() {
  return (
    <BrowserRouter>
        <header style={{ marginBottom: '1rem' }}>
          <AutocompleteSearch />
        </header>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App