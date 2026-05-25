import { db_pool_conexiones } from '../database/db.js';
import { responses_success, responses_not_found, responses_error, responses_created, bad_request } from '../responses/responses.js';

// Todos los tecnicos

export const obtenerTecnicos = async (req, res) => {
    try{
        const [rows] = await db_pool_conexiones.query('SELECT t.id, u.nombre, u.correo, t.telefono, t.especialidad FROM tecnicos t INNER JOIN usuarios u ON t.usuario_id = u.id');
        if (rows.length > 0){
            res.status(200).json(responses_success(rows, 'Listado de tecnicos obtenido exitosamente'));
        }else {
            res.status(404).json(responses_not_found('No se encontraron tecnicos'));
        }
    }catch(error){
        console.error('Error al obtener tecnicos: ', error);
        res.status(500).json(responses_error('Error al obtener tecnicos -> ' + error));
    }
}

// Obtener un tecnico por id

export const obtenerTecnicoId = async (req, res) => {
    try{
        const {id} = req.params;
        if (!id || isNaN(id)){
            return res.status(400).json(bad_request('El ID del tecnico es requerido y debe ser un numero valido'));
        }
        const [rows] = await db_pool_conexiones.query('SELECT t.id, u.nombre, u.correo, t.telefono, t.especialidad FROM tecnicos t INNER JOIN usuarios u ON t.usuario_id = u.id WHERE t.id = ?', [id]);
        if (rows.length > 0){
            res.status(200).json(responses_success(rows[0], 'El tecnico con el ID: ' + id + ' ha sido obtenido exitosamente'));
        }else {
            res.tatus(404).json(responses_not_found('No se encontro el tecnico con el ID proporcionado '));
        }
    }catch(error){
        console.error('Error al obtener el tecnico: ', error);
        res.status(500).json(responses_error('Error al obtener el tecnico -> ' + error));
    }
}

//Crear un nuevo tecnico
export const crearTecnico = async (req, res) => {
    try{
        const { nombre, correo, password, telefono, especialidad } = req.body;
        if (!nombre || !correo || !password || !telefono || !especialidad){
            return res.status(400).json(bad_request('Todos los campos son requeridos'));
        }

        //Crear usuario primero
        const [usuario] = await db_pool_conexiones.query('INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)', [nombre, correo, password, 'tecnico']);

        // Crear tecnico vinculado al usuario
        const [tecnico] = await db_pool_conexiones.query(' INSERT INTO tecnicos (usuario_id, telefono, especialidad) VALUES (?, ?, ?,)', [usuario.InsertId, telefono, especialidad]);
        res.status(201).json(responses_created(tecnico.insertId, 'Tecnico creado exitosamente'));
    }catch(error){
        console.error('Error al crear el tecnico: ', error);
        res.status(500).json(responses_error('Error al crear el tecnico -> ' + error));
    }
};

// Actualizar un tecnico
export const actualizarTecnico = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID del técnico es requerido y debe ser un número válido'));
        }
 
        const { nombre, correo, telefono, especialidad } = req.body;
        if (!nombre || !correo || !telefono || !especialidad) {
            return res.status(400).json(bad_request('Todos los campos son requeridos'));
        }
 
        // Obtener usuario_id del técnico
        const [tecnico] = await db_pool_conexiones.query('SELECT usuario_id FROM tecnicos WHERE id = ?', [id]);
        if (tecnico.length === 0) {
            return res.status(404).json(responses_not_found('No se encontró técnico con el ID proporcionado'));
        }
 
        // Actualizar usuario
        await db_pool_conexiones.query(
            'UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?',
            [nombre, correo, tecnico[0].usuario_id]
        );
 
        // Actualizar técnico
        await db_pool_conexiones.query(
            'UPDATE tecnicos SET telefono = ?, especialidad = ? WHERE id = ?',
            [telefono, especialidad, id]
        );
 
        res.status(200).json(responses_success(null, 'Técnico actualizado exitosamente'));
    } catch (error) {
        console.error('Error al actualizar técnico:', error);
        res.status(500).json(responses_error('Error al actualizar técnico -> ' + error.message));
    }
};

// Eliminar un tecnico
export const eliminarTecnico = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID del técnico es requerido y debe ser un número válido'));
        }
        
        // Al eliminar el usuario se elimina el técnico por CASCADE
        const [tecnico] = await db_pool_conexiones.query('SELECT usuario_id FROM tecnicos WHERE id = ?', [id]);
        if (tecnico.length === 0) {
            return res.status(404).json(responses_not_found('No se encontró técnico con el ID proporcionado'));
        }
 
        await db_pool_conexiones.query('DELETE FROM usuarios WHERE id = ?', [tecnico[0].usuario_id]);
        res.status(200).json(responses_success(null, 'Técnico eliminado exitosamente'));
    } catch (error) {
        console.error('Error al eliminar técnico:', error);
        res.status(500).json(responses_error('Error al eliminar técnico -> ' + error.message));
    }
};