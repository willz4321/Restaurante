import { Tooltip } from 'react-tooltip';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '../components';

export const Navbar = () => {
  const role = useSelector(state => state.auth.user.rol.nombre);  // Selecciona el rol del estado de Redux
  const {starLogout} = useAuth(); 

  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="#">Restaurante</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {(role === 'GERENTE' || role === 'MOZO') && (
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Salon</Link>
              </li>
            )}
            {(role === 'GERENTE' || role === 'CEO') && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/empleados">Empleados</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ventas">Ventas</Link>
                </li>
              </>
            )}
            {role === 'CEO' && (
              <li className="nav-item">
                <Link className="nav-link" to="/ceo">CEO</Link>
              </li>
            )}
          </ul>
        </div>
        <div className="navbar-end">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 512 512" data-tooltip-id='svgTooltip' data-tooltip-content='Cerrar sesion' onClick={starLogout}>
            <path fill="#f53100" d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
          </svg>
          <Tooltip id='svgTooltip'/>
        </div>
      </div>
    </nav>
  )
}
