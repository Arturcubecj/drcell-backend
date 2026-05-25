import { db_pool_conexiones } from "../database/db";
import { responses_success, responses_not_found, responses_error, bad_request } from '../responses/responses.js';
// Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
    try{
        const [rows] = await db_pool_conexiones.query('SELECT * FROM clientes');
        if(rows.legth > 0){
            res.status(200).json(responses_success(rows, 'Listado de clientes obtenido exitosamente...'))
        }else{
            res.status(404).json(responses_not_found('No se encontraron clientes...'));
        }
    }catch(error){
        console.error('Error al obtener clientes; ', error);
        res.status(500).json(responses_error('Error al obtener clientes ->' +error.message));
    }
};

// Obtener cliente por id
export const obtenerClienteById = async (req, res) => {
    try{
        const {id} = req.parms;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID del cliente es requerido y debe ser un numero valido'));
        }
        const [rows] = await db_pool_conexiones.query(' SELECT * FROM clientes Where id = ? ' , [id]);
        if (rows.lenght > 0 ){
            res.status(200).json(responses_success(rows[0], 'El Cliente fue obtenido exitosamente...'));
        } else {
            res.status(404).json(responses_not_found('El cliente con el ID ingresado no existe...'));
        }
        }catch(error){
            console.error('Error al obtener el cliente por id; ', error);
            res.status(500).json(responses_error('Error al obtener el cliente por id -> ' +error.message));
    }
};

// Crear Cliente
export const crearCliente = async (req, res) => {
    try{
        const { cedula, nombre, telefono, correo, direccion } = req.body;
        if (!cedula || !nombre || !telefono){
            return res.status(400).json(bad_request('Cedula, nombre y telefono son requeridos'));
        }
        const [rows] = await db_pool_conexiones.query('INSERT INTO clientes (cedula, nombre, telefono, correo, direccion) VALUES (?, ?, ?, ?, ?)', [cedula, nombre, telefono, correo, direccion]);
        res.status(201).json(responses_success(rows, 'Cliente creado exitosamente...'));
    }catch(error){
        console.error('Error al crear cliente; ', error);
        res.status(500).json(responses_error('Error al crear cliente -> ' +error.message));
    }
};    

// Actualizar cliente
export const actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID del cliente es requerido y debe ser un número válido'));
        }
 
        const { cedula, nombre, telefono, correo, direccion } = req.body;
        if (!cedula || !nombre || !telefono) {
            return res.status(400).json(bad_request('Cédula, nombre y teléfono son requeridos'));
        }
 
        const [rows] = await db_pool_conexiones.query(
            'UPDATE clientes SET cedula = ?, nombre = ?, telefono = ?, correo = ?, direccion = ? WHERE id = ?',
            [cedula, nombre, telefono, correo, direccion, id]
        );
 
        if (rows.affectedRows === 0) {
            return res.status(404).json(responses_not_found('No se encontró cliente con el ID proporcionado'));
        }
        res.status(200).json(responses_success(null, 'Cliente actualizado exitosamente'));
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json(responses_error('Error al actualizar cliente -> ' + error.message));
    }
};

// Eliminar cliente
export const eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID del cliente es requerido y debe ser un número válido'));
        }
 
        const [rows] = await db_pool_conexiones.query('DELETE FROM clientes WHERE id = ?', [id]);
        if (rows.affectedRows > 0) {
            res.status(200).json(responses_success(null, 'Cliente eliminado exitosamente'));
        } else {
            res.status(404).json(responses_not_found('No se encontró cliente con el ID proporcionado'));
        }
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json(responses_error('Error al eliminar cliente -> ' + error.message));
    }
};