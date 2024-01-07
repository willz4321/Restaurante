import { useDispatch } from "react-redux";
import { useEffect, useState } from "react"
import { apiRestaurante } from "../../api/apiRestaurante";

export const useMenus = () => {
    const dispatch = useDispatch();
    const [menu, setMenu] = useState();
    useEffect(() => {
        const fetchMenu = async() => {
     
            try {
                const response = await apiRestaurante.get("/menus");
                setMenu(response.data)
            } catch (error) {
                console.log(error.message);
            }
         };
         fetchMenu();
       }, [dispatch])
       
        return menu;
}
