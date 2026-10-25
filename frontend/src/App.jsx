import { Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './paginas/Inicio';
import Acceso from './paginas/Acceso';
import Panel from './paginas/Panel';
import Admin from './paginas/Admin';
import CookiesBanner from './componentes/CookiesBanner';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/acceso" element={<Acceso />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookiesBanner />
    </>
  );
}