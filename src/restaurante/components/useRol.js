import { useDispatch } from "react-redux";
import { useEffect, useState } from "react"
import { apiRestaurante } from "../../api/apiRestaurante";

export const useRol = () => {
    const dispatch = useDispatch();
    const [rol, setRol] = useState();
    useEffect(() => {
        const fetchRoles = async() => {
     
            try {
                const response = await apiRestaurante.get("/roles");
                setRol(response.data)
            } catch (error) {
                console.log(error);
            }
         };
         fetchRoles();
       }, [dispatch])
     
        return rol;
}
