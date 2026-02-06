import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import Chambres from './pages/Chambres/Chambres';
import Clients from './pages/Clients/Clients';
import Reservations from './pages/Reservations/Reservations';
import NouvelleReservation from './pages/NouvelleReservation/NouvelleReservation';
import Statistiques from './pages/Statistiques/Statistiques';
import './styles/global.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chambres" element={<Chambres />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/reservations/nouvelle" element={<NouvelleReservation />} />
            <Route path="/statistiques" element={<Statistiques />} />
            <Route path="/parametres" element={
              <div className="coming-soon">
                <h1>⚙️ Paramètres</h1>
                <p>Cette page est en construction</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;