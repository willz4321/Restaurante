import { useDispatch, useSelector } from "react-redux"
import { apiRestaurante } from '../../api/apiRestaurante';
import { checkingCredentials, clearErrorMessage, onLogut, onlogin } from '../../store/slices/authSlice';


export const useAuth = () => {
    const {status, user, errorMenssage} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const starLogin = async(id) => {
   
        dispatch(checkingCredentials());
           
        try {
            
            const {data} = await apiRestaurante.get(`/empleado/${id}`);
             console.log(data)
           dispatch(onlogin({ id: data.id, name: data.nombre, rol: data.rol }))

        } catch (error) {
            console.log("Error de backend: " + error) 
            dispatch(onLogut(error.response.data))
            setTimeout(() => {
                dispatch( clearErrorMessage);
            },10);
        }
    }

    const starLogout = async() =>{
          localStorage.clear();
          dispatch(onLogut());
    }

    const starRegister = async({userName, email, password}) => {

           dispatch(checkingCredentials());

           try {

            const {data} = await apiRestaurante.post('register',{correo: email, userName, password})
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            dispatch(onlogin({ id:data.id, name: data.userName, email: data.correo}))
               
           } catch (error) {
                dispatch(onLogut(error.response.data))
                setTimeout(() => {
                    dispatch( clearErrorMessage);
                },10);
           }
    }


    return {
        //* Propiedades
        errorMenssage,
        status,
        user,

        //* Metodos
        starLogin,
        starLogout,
        starRegister,
    }
}
