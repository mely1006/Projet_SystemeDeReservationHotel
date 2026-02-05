import './Header.css';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const Header = ({ title, subtitle, actions }: HeaderProps) => {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-text">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        <div className="header-actions">
          {!actions && <div className="date-display">📅 {currentDate}</div>}
          {actions}
        </div>
      </div>
    </header>
  );
};

export default Header;