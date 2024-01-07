
import { Link } from "react-router-dom";
import  mesaImg from "../../assets/mesa.png";
import { useEmpleados, useMesas } from "../components/";
import { useEffect } from "react";
import { useSelector } from "react-redux";


export const Salon = () => {
  const  {mesas, getMesas} = useMesas();
  const { empleado, getEmpleados} = useEmpleados();

  useEffect(() => {
    getMesas()
    getEmpleados()
  }, [])

  const user = useSelector(state => state.auth.user);

  const empleadoActual = empleado.find(emp => emp.id === user.id);
  const mesasEmpleado = empleadoActual ? empleadoActual.mesas.map(mesa => mesa.id) : [];


 
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{height: '100vh'}}>
      <div className="row">
        {(user.rol.nombre === 'CEO' || user.rol.nombre === 'GERENTE' ? mesas : mesas.filter(mesa => mesasEmpleado.includes(mesa.id))).map((mesa) => 
          <div key={mesa.id} className="col-sm-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{mesa.nombre}</h5>
                <img src={mesaImg} alt={mesa.nombre} className="img-fluid" style={{maxWidth: '150px'}} />               
                <Link to={`/mesa/${mesa.id}`} className={`btn btn-primary mt-3 ms-3 ${user.rol.nombre === 'CEO' ? 'svg-disabled' : ''} `}>Seleccionar</Link>
              </div>
            </div>
          </div>
        )}
        {mesasEmpleado.length === 0 && (user.rol.nombre === 'MOZO') && 
          <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <h3>El Mozo no tiene mesas asignadas. Hable con el GERENTE.</h3>
          </div>
        }
      </div>
    </div>
  );
  

}
