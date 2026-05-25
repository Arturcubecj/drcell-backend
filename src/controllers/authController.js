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
        const [rows] = await db_pool_conexiones.query('SELECT id, nombre, correo, rol FROM usuarios WHERE correo = ? AND password = ? AND rol - ?', [correo, password, rol]);

        if( rows.length === 0){
            return res.status(404).json(responses_not_found('Correo o contraseña o rolincorrectos'));
        }
        const usuario = rows[0];
        res.status(200).json(responses_success(usuario, 'Inicio de sesion exitoso...'));

        }catch(error) {
            console.error('Error en el login: ', error);
            res.status(500).json(responses_error('Error al inciar sesion ->', +error.message));
    }
};