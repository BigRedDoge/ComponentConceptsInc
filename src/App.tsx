import { Navigate, Route, Routes } from 'react-router';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Contact } from './components/layout/Contact';
import { Home } from './pages/Home';
import { Products } from './pages/Products';

function Layout() {
  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <main id="main-content" className="flex-1">
        <Routes>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Contact />
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/*" element={<Layout />} />
    </Routes>
  );
}

export default App;
