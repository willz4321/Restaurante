import { checkingCredentials } from "../../store/slices/authSlice";


export const checkingAuthentication = ( ) => {
    return async(dispatch) => {

        dispatch( checkingCredentials());
    }
}