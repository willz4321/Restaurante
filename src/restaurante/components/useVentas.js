import { useState } from "react"
import { apiRestaurante } from "../../api/apiRestaurante"
import { useDispatch } from "react-redux";
import { setVentasDate } from "../../store/slices/RestauranteSlice";
import Swal from 'sweetalert2';

export const useVentas = () => {
   const [ventas, setVentas] = useState([])
   const dispatch = useDispatch();
   
    const getVentas = async() => {
         try {
             const resp = await apiRestaurante.get('/ventas')
             setVentas(resp.data)
             console.log(resp.data)
             dispatch(setVentasDate(resp.data))
         } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
        });
         }
    }

    const getMenuById = async(id) => {
          try {
              const resp = await apiRestaurante.get(`/menus/${id}`)
              console.log(resp.data)
              return resp.data
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.response.data.message,
          });
          }
    }

    const newVenta = async(venta) => {
         try {
             const resp = await apiRestaurante.post('/ventas', venta)
              getVentas()
              Swal.fire({
                icon: 'success',
                title: 'Genial',
                text: "Pedido solicitado",
            });
              return resp.data
              
         } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response.data.message,
        });
         }
    }

  return {
    ventas,
    
    getMenuById,
    getVentas,
    newVenta
  }
}
