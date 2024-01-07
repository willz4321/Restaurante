import { useEffect, useState } from "react";
import { useVentas } from "../components/useVentas";
import Modal from 'react-modal';
import { useEmpleados } from "../components";

Modal.setAppElement('#root'); // Esto es necesario para la accesibilidad

export const Ventas = () => {
  const { ventas, getVentas } = useVentas();
  const {getEmpleadoById} = useEmpleados();
  const [sortOrder, setSortOrder] = useState('asc');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  

  useEffect(() => {
    getVentas();
  }, []);

  const sortVentas = () => {
    let sortedVentas = [...ventas];
    if (sortOrder === 'asc') {
      sortedVentas.sort((a, b) => new Date(a.fechaVenta) - new Date(b.fechaVenta));
      setSortOrder('desc');
    } else {
      sortedVentas.sort((a, b) => new Date(b.fechaVenta) - new Date(a.fechaVenta));
      setSortOrder('asc');
    }
    return sortedVentas;
  };
  

  const openModal = async(venta) => {
    const response = await getEmpleadoById(venta.empleado);
    const empleado = response.data; // Accede a los datos del empleado en la respuesta
    setSelectedVenta({ ...venta, empleado });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary " onClick={sortVentas}>{sortOrder}</button>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Fecha de Venta</th>
            <th>Num. de Ticket</th>
            <th>Mesa</th>
            <th>Total de Venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta, index) => (
            <tr key={index}>
              <td>{new Date(venta.fechaVenta).toLocaleString()}</td>
              <td>{venta.id}</td>
              <td>{venta.mesa.nombre}</td>
              <td>$ {venta.totalVenta}</td>
              <td>
                <button className="btn btn-primary" onClick={() => openModal(venta)}>Ver</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Ticket"
        style={{
          content: {
            width: '400px',
            maxHeight: '60vh',
            overflow: 'auto', 
            margin: 'auto',
          },
        }}
      >
       {selectedVenta && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div>
              <h2>Ticket #{selectedVenta.id}</h2>
              <p>Fecha de Venta: {new Date(selectedVenta.fechaVenta).toLocaleString()}</p>
              <p className="pb-3"> 
                <span style={{float: 'left'}}>Mesa: {selectedVenta.mesa.nombre}</span> 
                <span style={{float: 'right'}}>{selectedVenta.empleado.nombre}</span>
              </p>
              <h3>Menú seleccionado:</h3>
              <ul className="list-unstyled pt-4">
              {selectedVenta.menusSelect.map((menu, index) => {
                      if (typeof menu === 'object') {
                        // Si 'menu' es un objeto, muestra sus detalles
                        return (
                          <li key={index}>
                            <span style={{float: 'left'}}>{menu.nombre}</span>
                            <span style={{float: 'right'}}>$ {menu.precio}</span>
                            <div style={{clear: 'both'}}></div>
                          </li>
                        );
                      } else if (typeof menu === 'number') {
                        // Si 'menu' es un número, asumimos que es un ID de menú y buscamos el menú en nuestras ventas
                        let menuData;
                        for (let venta of ventas) {
                          menuData = venta.menusSelect.find(m => m.id === menu);
                          if (menuData) break;
                        }
                        if (menuData) {
                          // Si encontramos el menú, mostramos sus detalles
                          return (
                            <li key={index}>
                              <span style={{float: 'left'}}>{menuData.nombre}</span>
                              <span style={{float: 'right'}}>$ {menuData.precio}</span>
                              <div style={{clear: 'both'}}></div>
                            </li>
                          );
                        }
                      }
                    })}
              </ul>
            </div>
            <div style={{ marginTop: 'auto' }}>
              <p className="pb-3">
                <span style={{float: 'left'}}>Total de Venta:</span> 
                <span style={{float: 'right'}}>$ {selectedVenta.totalVenta}</span>
              </p>
              <button onClick={closeModal} className="btn btn-outline-dark">Cerrar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
