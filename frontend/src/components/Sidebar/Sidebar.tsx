import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Dashboard' },
    { path: '/reservations', icon: '📅', label: 'Réservations' },
    { path: '/chambres', icon: '🏨', label: 'Chambres' },
    { path: '/clients', icon: '👥', label: 'Clients' },
    { path: '/statistiques', icon: '📊', label: 'Statistiques' },
    { path: '/parametres', icon: '⚙️', label: 'Paramètres' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-icon">◆</span>
        HotelPro
      </div>
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;