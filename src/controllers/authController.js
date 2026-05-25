import { db_pool_conexiones } from "../database/db";
import { responses_success, responses_not_found, responses_error, bad_request } from '../responses/responses.js';
export const login = async (req, res) => {
    try{
        const {correo, password, rol} = req.body;

        //Validar que los datos esten ingresados
        if (!correo || !password || !rol){
            return res.status(400),json(bad_request("Correo, contrasena y rol son requeridos"));
        }

        //Buscar usuario en la Bd
        const [rows] = await db_pool_conexiones.query(SELECT)



    }catch{

    }
}