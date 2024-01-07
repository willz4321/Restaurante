import { useEffect, useMemo, useState } from "react";
import { checkingAuthentication, useEmpleados } from "../components";
import { useAuth } from "../components/useAuth";
import { useDispatch, useSelector } from "react-redux";
import Swal from 'sweetalert2';


export const Login = () => {
  const [selectedEmpleado, setSelectedEmpleado] = useState({});
  const { empleado, getEmpleados } = useEmpleados();
  const {starLogin, errorMenssage} = useAuth();
  const {status} = useSelector( state => state.auth);
  const isAuthenticating = useMemo( () => status === 'checking', [status]);
  const dispacth = useDispatch();

  useEffect(() => {
    // Obtén la lista de empleados cuando se carga la página
    getEmpleados();
  }, []);

  useEffect(() => {
     
    if(errorMenssage !==undefined){
        Swal.fire('Error en la autenticacion', errorMenssage, 'error')
    }
  }, [errorMenssage])

  const onLoginSubmit = (event) => {

    event.preventDefault();
    starLogin(selectedEmpleado)
    dispacth(checkingAuthentication());
    
  }
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col col-lg-6">
          <h1>Iniciar sesión</h1>
          <div className="form-group">
            <label htmlFor="empleadoSelect">Empleado</label>
            <select className="form-control" id="empleadoSelect" value={selectedEmpleado} onChange={e => setSelectedEmpleado(e.target.value)}>
              <option value="">Selecciona un empleado</option> {/* Opción vacía */}
              {empleado.map((empleado, index) => (
                <option key={index} value={empleado.id}>{empleado.nombre} - {empleado.rol.nombre}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" disabled={isAuthenticating} type='submit' onClick={onLoginSubmit}>Iniciar sesión</button>
        </div>
      </div>
    </div>
  );
}  