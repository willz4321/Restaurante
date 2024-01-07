import { useSelector } from 'react-redux';
import { Link, useParams  } from 'react-router-dom';
import Modal from 'react-modal';
import  mesaImg from "../../assets/mesaMozo.png";
import { useEffect, useState } from 'react';
import { useEmpleados, useMenus, useMesas, useVentas } from '../components';
import { Tooltip } from 'react-tooltip';

export const Mesa = () => {

  const { id } = useParams();
  const mesaId = Number(id); // Convierte el ID a un número
  const mesa = useSelector(state => state.Restaurante.mesas.find(m => m.id === mesaId));
  const {empleado, getEmpleadoByIdMesa, getEmpleados} = useEmpleados()
  const {asignarMesa, getMesas} = useMesas()
  const menus = useMenus()
  const {newVenta} = useVentas()

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tempSelectedMenus, setTempSelectedMenus] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [empleadoMesa, setEmpleadoMesa] = useState([]);
  const [showTurnos, setShowTurnos] = useState(false);
  const [turnoActual, setTurnoActual] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [idMesa, setIdMesa] = useState(null);
  const role = useSelector(state => state.auth.user.rol.nombre);

 useEffect( () => {
    getEmpleadoByIdMesa(id).then(data => setEmpleadoMesa(data));   
  }, [id]); 

  useEffect(() => {
    getMesas()
    getEmpleados()
  },[])

  useEffect(() => {
    if (empleadoMesa.length > 0) {
      setIdMesa(empleadoMesa[0].id);
    }
  }, [empleadoMesa]);

  useEffect(() => {
 
      setTurnoActual({id: 0, horario: ''}); 

  }, []);

  const openModal = () => {
    setModalIsOpen(true);
    setTempSelectedMenus([...selectedMenus]);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleMenuSelect = (menuId) => {
    if (tempSelectedMenus.includes(menuId)) {
      setTempSelectedMenus(tempSelectedMenus.filter(id => id !== menuId));
    } else {
      setTempSelectedMenus([...tempSelectedMenus, menuId]);
    }
  };

  const handleSave = () => {
    setSelectedMenus([...tempSelectedMenus]); 
    closeModal();
  };
  
  const handleToggleTurnos = () => {
    setIsEditing(!isEditing);
    setShowTurnos(!showTurnos); 
  };

  const handleTurnoChange = async(event) => {    

   const horario = event.target.value;
   
    for (let i = 0; i < empleado.length; i++) {
     
      const turnoSeleccionado = empleado[i].turnos.find(turno => turno.horario === horario);

      if (turnoSeleccionado) {
        console.log(turnoSeleccionado.id);
        setTurnoActual({id :turnoSeleccionado.id,horario: horario}) 
       
        break; 
      }
    }
  };
  const asignarMesaEmp = async(mesaId, empleadoId, turnoId, turnos) => {
    
    console.log(turnoId)
    console.log(turnos)

    if ( turnoId === 0){
      await asignarMesa(mesaId, empleadoId, turnos[0].id);
      setTurnoActual(turnos[0])
      getEmpleadoByIdMesa(id).then(data => setEmpleadoMesa(data));
      getEmpleados();
    }else if (turnoId !== 0){
      await asignarMesa(mesaId, empleadoId, turnoId);
      getEmpleadoByIdMesa(id).then(data => setEmpleadoMesa(data));
      getEmpleados();
    }
    
  };

  const realizarVenta = async () => {
    // Recopila los datos de la venta
    const venta = {
      empleado: {
        id: idMesa, // Asegúrate de que este es el ID correcto
      },
      turno: {
        id: turnoActual.id, // Asegúrate de que este es el ID correcto
      },
      mesa: {
        id: mesaId,
      },
      menusSelect: selectedMenus.map(menuId => ({ id: menuId })),

      fechaVenta: new Date().toISOString(), // Esto establecerá la fechaVenta a la fecha y hora actuales
    
    };
    setSelectedMenus([]);

    console.log(venta)
    await newVenta(venta);
  };

  return (
    <div className="container mt-5">
    <div className="row align-items-center" >
      <div className="col-md-4">
        <h2 className="mb-3">{mesa.nombre}</h2>
        <img src={mesaImg} alt="Imagen de la mesa" className="img-fluid" style={{maxWidth: '400px'}} />
      </div>
      
        <div  className="col-md-8" style={{height: '400px'}}>
       
    <div className='row mb-8'>
        <div className="col">
        <button type="button" className="btn btn-success mb-3" data-bs-toggle="modal" data-bs-target="#myModal" >Asignar Mozo</button>
          <div className="modal fade" id="myModal">
              <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                      <div className="modal-header">
                          <h4 className="modal-title">Asignar Mozo</h4>
                      </div>
                      <div className="modal-body">
                        <table className='table table-striped mt-3'>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Nombre</th>
                              <th>Turno</th>
                            </tr>                            
                          </thead>
                          <tbody>
                            {empleado && empleado.filter(emp => emp.rol.nombre === 'MOZO').map((empleado) => (
                            <tr key={empleado.id}>
                              <td >{empleado.id} </td>
                              <td>{empleado.nombre}</td>
                              <td>
                              {isEditing ? (
                                  <select onChange={handleTurnoChange} className="form-select mb-3">
                                    {empleado.turnos && empleado.turnos.map((turno) => (
                                      <option key={turno.id} value={turno.horario} >{turno.horario}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <p>{empleado.turnos && empleado.turnos[0] && empleado.turnos[0].horario}</p>


                                )}
                              </td>
                              <td>
                              {empleado.turnos.length > 1 && <button onClick={handleToggleTurnos} className="btn btn-outline-success">Cambiar turno</button>}
                              </td>
                              <td> <button className='btn btn-outline-primary' data-bs-dismiss="modal"
                                onClick={() =>  asignarMesaEmp(mesaId, empleado.id, turnoActual.id, empleado.turnos )}
                              >Seleccionar</button>
                              </td>
                            </tr>      
                            ))}
                          </tbody>  
                        </table>     
                      </div>
                      <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                      </div>
                  </div>
              </div>
          </div>
        </div>
    </div>
       
            {empleadoMesa.map((emp, index) => (
      (() => {
        if (emp.id === idMesa) {
          return (
        <div key={index} className="row mb-3">
          <div className="col-md-2">
            <p><strong>Mozo ID:</strong></p>
            <p>{emp.id}</p>
          </div>
          <div className="col-md-2">
            <p><strong>Nombre:</strong></p>
            <p>{emp.nombre}</p>
          </div>
          <div className="col-md-2">
            <p><strong>Turno:</strong></p>
            {isEditing ? (
              <select onChange={handleTurnoChange} className="form-select mb-3">
                {emp.turnos.map((turno, i) => (
                  <option key={i} value={turno.horario}>{turno.horario}</option>
                ))}
              </select>
            ) : (
              <p>{turnoActual ? turnoActual.horario : emp.turnos[0].horario}</p>
            )}
          </div>
          <div className="col-md-1 pt-3">
            {emp.turnos.length > 1 && 
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 512 512" onClick={handleToggleTurnos} data-tooltip-id='svgTooltip3' data-tooltip-content='Cambiar Turno'><path fill="#5479bb" d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z"/></svg> 
                          }
                          <Tooltip id='svgTooltip3'/>
          </div>
          <div className='col-md-1 '>
            <svg xmlns="http://www.w3.org/2000/svg" height="25" width="30" viewBox="0 0 448 512" onClick={openModal} className='mt-3' data-tooltip-id='svgTooltip' data-tooltip-content='Menu' >
            <path fill="#510505" d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"/>
            </svg>
            <Tooltip id='svgTooltip'/>
          </div>
          <div className='col-md-2'>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" width="30" viewBox="0 0 640 512" className={`mt-3 ${role === 'MOZO' ? 'svg-disabled' : ''}`} data-tooltip-id='svgTooltip2' data-tooltip-content='Cambiar usuario' data-bs-toggle="modal" data-bs-target="#ListMozos"  disabled={role === 'MOZO'}><path fill='#5db0b6' d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"/>
              </svg>
              <Tooltip id='svgTooltip2'/>  
              <div className="modal fade" id="ListMozos">
                      <div className="modal-dialog modal-lg">
                          <div className="modal-content">
                              <div className="modal-header">
                                  <h4 className="modal-title">Cambiar Mozo</h4>
                              </div>
                              <div className="modal-body">
                                <table className='table table-striped mt-3'>
                                  <thead>
                                    <tr>
                                      <th>ID</th>
                                      <th>Nombre</th>
                                      <th>Turno</th>                           
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {empleadoMesa.map((mozo) => {
                                      if (mozo.id !== idMesa) {
                                        return (
                                          <tr key={mozo.id}>
                                            <td >{mozo.id} </td>
                                            <td>{mozo.nombre}</td>
                                            <td>
                                                <p>{mozo.turnos[0].horario}</p>
                                            </td>
                                            <td>
                                            
                                            </td>
                                            <td> <button className='btn btn-outline-primary' data-bs-dismiss="modal"
                                              onClick={() => {setIdMesa(mozo.id), setTurnoActual(mozo.turnos[0])}}
                                            >Seleccionar</button>
                                            </td>
                                          </tr>      
                                        );
                                      }
                                    })}
                                  </tbody>  
                                </table>     
                              </div>
                              <div className="modal-footer">
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                              </div>
                          </div>
                      </div>
                  </div>
          </div>      
        </div>
      );
    }
  })()
))}


          <div className='row mb-3'>
            <ul className="list-group mt-3">
              {selectedMenus.map((menuId) => {
                const menu = menus.find((menu) => menu.id === menuId);
                return <li key={menuId} className="list-group-item">{menu.nombre}</li>;
              })}
            </ul>
          </div>
        </div>
     
    </div>
     
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Menú"
        style={{
          content: {
            width: '50%',
            height: '50%',
            margin: 'auto',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <div style={{ height: '100%', width: '80%', overflow: 'auto' }}>
          <table className="table">
            <thead style={{ position: 'sticky', top: 0 , backgroundColor: 'white'}}>
              <tr>
                <th scope="col">Nombre del menú</th>
                <th scope="col">Precio</th>
                <th scope="col">Seleccionar</th>
              </tr>
            </thead>
            <tbody >
              {menus && menus.map((menu, index) => (
                <tr key={index}>
                  <td>{menu.nombre}</td>
                  <td>$ {menu.precio}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={tempSelectedMenus.includes(menu.id)}
                      onChange={() => handleMenuSelect(menu.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between w-100">
          <button className="btn btn-primary" onClick={handleSave}>Seleccionar</button>
          <button className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
        </div>
      </Modal>

      <Link to="/" className="btn btn-secondary mt-3">Atrás</Link>
      <button className="btn btn-success mt-3" onClick={realizarVenta}  disabled={selectedMenus.length === 0}>Realizar pedido</button>
      
    </div>
  );
};
