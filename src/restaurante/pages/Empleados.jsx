import { useEffect, useState } from "react";
import { useEmpleados, useRol } from "../components/";
import { useTurnos } from "../components/useTurnos";
import { useSelector } from "react-redux";
import { Tooltip } from 'react-tooltip';

export const Empleados = () => {
  const {empleado = [], getEmpleados, deleteEmpleado, editEmpleado, newEmpleadoCrud} = useEmpleados()
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [isEditing, setIsEditing] = useState(null)
  const [newEmpleado, setNewEmpleado] = useState({ nombre: '', rol: { id: '', nombre: ''} });
  const listRoles = useRol()
  const listTurnos = useTurnos();
  const currentUserRole = useSelector(state => state.auth.user.rol.nombre);

useEffect(() => {
  console.log("roles")
  console.log(listRoles)
  getEmpleados()
},[])

  return (

    <div className="container">
      <h1 className="my-4">Empleados</h1>
      <table className="table table-hover">
        <thead>
          <tr className="table-light table-hover">
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Turno</th>
            <th scope="col">Rol</th>
            <th>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="30" viewBox="0 0 640 512" data-bs-toggle="modal" data-bs-target="#NewEmpleado" data-tooltip-id='svgTooltip' data-tooltip-content='Contratar Empleado'><path fill="#3fabee" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
            <Tooltip id='svgTooltip'/>
            <div className="modal fade" id="NewEmpleado">
            <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Contratar empleado</h5>
                    <button type="button" className="close"  data-bs-dismiss="modal">
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" className="form-control" value={newEmpleado.nombre} onChange={e => setNewEmpleado({ ...newEmpleado, nombre: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Rol</label>
                        <select className="form-control" defaultValue={newEmpleado.rol.nombre}
                            onChange={(e) => {
                              const selectedRol = listRoles.find(rol => rol.nombre === e.target.value);
                              setNewEmpleado({
                                  ...newEmpleado,
                                  rol: { id: selectedRol.id, nombre: selectedRol.nombre }
                              });
                          }}
                            >
                             <option>Elegir Rol</option>
                                {listRoles && listRoles.map((rol) => {
                                  if (currentUserRole === 'CEO' && rol.nombre !== 'CEO') {
                                    return <option key={rol.id}>{rol.nombre}</option>
                                  } else if (currentUserRole === 'GERENTE' && rol.nombre === 'MOZO') {
                                    return <option key={rol.id}>{rol.nombre}</option>
                                  }
                                })}

                         </select>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary"  data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" className="btn btn-primary"  data-bs-dismiss="modal" onClick={() => newEmpleadoCrud(newEmpleado)}>Contratar</button>
                  </div>
                </div>
              </div>
            </div>
            </th>
          </tr>
        </thead>
        <tbody>
        {empleado && empleado
             .filter(empleado => {
              // Si el usuario actual es un gerente, solo muestra a los mozos
              if (currentUserRole === 'GERENTE') {
                return empleado.rol.nombre === 'MOZO';
              }
              // Si el usuario actual es un CEO, muestra a los gerentes y mozos
              if (currentUserRole === 'CEO') {
                return empleado.rol.nombre !== 'CEO';
              }
              // Si el usuario actual no es un gerente ni un CEO, no muestra ningún empleado
              return false;
            }).map((empleado) => (
            <tr key={empleado.id} className=" table-success">
              <th scope="row">{empleado.id}</th>
              <td>{empleado.nombre}</td>

              <td style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', height: '60px'}}>
                  {isEditing === empleado.id ? (
                    <>
                      {editingEmpleado.turnos.map((turno, index) => (
                        <div key={index} style={{ marginRight: '20px', marginBottom: '10px' }}>
                          <select defaultValue={turno.horario || 'Sin asignar'} // Predeterminado a 'Sin asignar'
                            onChange={(e) => {
                              const selectedTurno = listTurnos.find(t => t.horario === e.target.value);
                              let newTurnos = [...editingEmpleado.turnos];
                              if (e.target.value === 'Sin asignar') {
                                newTurnos.splice(index, 1); // Elimina el turno si se selecciona 'Sin asignar'
                              } else {
                                newTurnos[index] = { id: selectedTurno.id, horario: selectedTurno.horario };
                              }
                              setEditingEmpleado({
                                ...editingEmpleado,
                                turnos: newTurnos
                              });
                            }}
                          >
                            <option>Sin asignar</option> {/* Agrega la opción 'Sin asignar' al principio */}
                            {listTurnos.map((t) => (
                              <option key={t.id}>{t.horario}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                      {editingEmpleado.turnos.length < 2 && editingEmpleado.rol.nombre === 'MOZO' &&  (
                        <button onClick={() => {
                          setEditingEmpleado({
                            ...editingEmpleado,
                            turnos: [...editingEmpleado.turnos, {horario: 'Sin asignar'}] // Agrega un turno con horario 'Sin asignar'
                          });
                        }}>Agregar turno</button>
                      )}
                    </>
                  ) : (
                    empleado.turnos.map((turno, index) => <div key={index} style={{ marginRight: '20px', marginBottom: '10px' }}>{turno.horario}</div>)
                  )}
                </td>


              <td>
                {isEditing === empleado.id ? (
                    <select defaultValue={empleado.rol.nombre}
                    onChange={(e) => {
                      const selectedRol = listRoles.find(rol => rol.nombre === e.target.value);
                      setEditingEmpleado({
                          ...editingEmpleado,
                          rol: { id: selectedRol.id, nombre: selectedRol.nombre }
                      });
                  }}
                    >
                    {listRoles.map((rol) => (
                      <option key={rol.id}>{rol.nombre}</option>
                    ))}
                    </select>          
                 ) : (
                  empleado.rol.nombre
                )}
                </td>
              <td style={{marginRight: 0, width: '300px'}}>
                {isEditing === empleado.id && <button className="btn btn-outline-success" onClick={() => editEmpleado(empleado.id, editingEmpleado, setIsEditing(null))}>Guardar</button>}
                <button className="btn btn-outline-primary" style={{ marginRight: '20px' }}
                 onClick={() => {
                      setIsEditing(empleado.id);
                      setEditingEmpleado(empleado);
                      }}>Editar</button>
                <button className="btn  btn-outline-danger" onClick={() => deleteEmpleado(empleado.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
</div>


  )
}
