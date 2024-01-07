import axios from "axios";

export const apiRestaurante = axios.create({
    // baseURL: 'http://restaurante.us-east-2.elasticbeanstalk.com/api/restaurante'
    baseURL: 'http://localhost:8080/api/restaurante'
});
