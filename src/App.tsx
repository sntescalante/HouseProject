import './App.css';
import { Link, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import Room1 from './pages/Room1';
import Room2 from './pages/Room2';
import Room3 from './pages/Room3';

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Panel IoT</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/room1">Cuarto 1</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/room2">Cuarto 2</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/room3">Cuarto 3</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/room1" replace />} />
          <Route path="/room1" element={<Room1 />} />
          <Route path="/room2" element={<Room2 />} />
          <Route path="/room3" element={<Room3 />} />
          <Route path="*" element={<div className="alert alert-danger"><h2>404 - Página no encontrada</h2></div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
