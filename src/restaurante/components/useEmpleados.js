import { useState } from "react";
import { apiRestaurante } from "../../api/apiRestaurante";
import { useDispatch } from "react-redux";
import { setEmpleadosDate } from "../../store/slices/RestauranteSlice";
import Swal from 'sweetalert2';


export const useEmpleados = () => {
   const [empleado, setEmpleado] = useState([]);
   const dispatch = useDispatch();
 
   const getEmpleados = async() => {

    try {
        const response = await apiRestaurante.get("/empleados");
        setEmpleado(response.data)
         dispatch(setEmpleadosDate(response.data))
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
        });
    }
  }

  const newEmpleadoCrud = async(empleado) => {
        try {
            const response = await apiRestaurante.post(`/usuarios`,empleado);
            getEmpleados(); 
            return response.data;  
        } catch (error) {
        
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
            });
        }
    }

    const getEmpleadoById = async(id) => {
        try {
           return await apiRestaurante.get(`/empleado/${id}`)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
            });
        }
    }

    const getEmpleadoByIdMesa = async(id) => {
        try {
           const resp = await apiRestaurante.get(`/empleados/mesa/${id}`)
           return resp.data
        } catch (error) {
            console.log(error.message)
        }
    }

    const editEmpleado = async(id, updatedEmpleado) => {
        try {
            const response = await apiRestaurante.put(`/empleados/${id}`, updatedEmpleado);
            getEmpleados(); 
            return response.data;  
        } catch (error) {
           
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response.data.message,
            });
        }
    }

  const deleteEmpleado = async(id) => {
    try {
        await apiRestaurante.delete(`/empleados/${id}`);
        getEmpleados(); 
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
        });
    }
  }
            
     
        return {
           // objetos
            empleado,

            // funciones
            newEmpleadoCrud,
            getEmpleados,
            editEmpleado,
            deleteEmpleado,
            getEmpleadoById,
            getEmpleadoByIdMesa,
        };
}
