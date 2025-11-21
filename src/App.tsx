import './App.css';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import Room1 from './pages/Room1';
import Room2 from './pages/Room2';
import Room3 from './pages/Room3';

function App() {
  return (
    <div>
      <nav style={styles.nav}>
        <h2 style={styles.brand}>Panel IoT</h2>
        <ul style={styles.navList}>
          <li><Link to="/room1">Cuarto 1</Link></li>
          <li><Link to="/room2">Cuarto 2</Link></li>
          <li><Link to="/room3">Cuarto 3</Link></li>
        </ul>
      </nav>
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/room1" replace />} />
          <Route path="/room1" element={<Room1 />} />
          <Route path="/room2" element={<Room2 />} />
          <Route path="/room3" element={<Room3 />} />
          <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
        </Routes>
      </main>
    </div>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    background: '#222',
    color: '#fff'
  },
  brand: {
    margin: 0
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    gap: '18px',
    margin: 0,
    padding: 0
  },
  main: {
    padding: '24px'
  }
} as const;

export default App;
