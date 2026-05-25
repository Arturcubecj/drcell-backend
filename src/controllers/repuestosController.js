import { db_pool_conexiones } from '../database/db.js';
import { responses_success, responses_not_found, responses_error, responses_created, bad_request} from '../responses/responses.js';

// ── Obtener todos los repuestos ───────────────────────────────
export const obtenerRepuestos = async (req, res) => {
    try {
        const [rows] = await db_pool_conexiones.query('SELECT * FROM repuestos');
        if (rows.length > 0) {
            res.status(200).json(responses_success(rows, 'Listado de repuestos obtenido exitosamente'));
        } else {
            res.status(404).json(responses_not_found('No se encontraron repuestos registrados'));
        }
    } catch (error) {
        console.error('Error al obtener repuestos:', error);
        res.status(500).json(responses_error('Error al obtener repuestos -> ' + error.message));
    }
};

// ── Obtener repuesto por ID ───────────────────────────────────
export const obtenerRepuestoById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID del repuesto es requerido y debe ser un número válido'));
        }
        const [rows] = await db_pool_conexiones.query('SELECT * FROM repuestos WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json(responses_success(rows[0], 'Repuesto obtenido exitosamente'));
        } else {
            res.status(404).json(responses_not_found('No se encontró repuesto con el ID proporcionado'));
        }
    } catch (error) {
        console.error('Error al obtener repuesto:', error);
        res.status(500).json(responses_error('Error al obtener repuesto -> ' + error.message));
    }
};

// ── Crear repuesto ────────────────────────────────────────────
export const crearRepuesto = async (req, res) => {
    try {
        const { nombre, compatibilidad, stock, precio } = req.body;

        if (!nombre || !compatibilidad || stock === undefined || !precio) {
            return res.status(400).json(bad_request('Todos los campos son requeridos'));
        }

        const [rows] = await db_pool_conexiones.query(
            'INSERT INTO repuestos (nombre, compatibilidad, stock, precio) VALUES (?, ?, ?, ?)',
            [nombre, compatibilidad, stock, precio]
        );
        res.status(201).json(responses_created(rows.insertId, 'Repuesto creado exitosamente'));
    } catch (error) {
        console.error('Error al crear repuesto:', error);
        res.status(500).json(responses_error('Error al crear repuesto -> ' + error.message));
    }
};

// ── Actualizar repuesto ───────────────────────────────────────
export const actualizarRepuesto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID del repuesto es requerido y debe ser un número válido'));
        }

        const { nombre, compatibilidad, stock, precio } = req.body;
        if (!nombre || !compatibilidad || stock === undefined || !precio) {
            return res.status(400).json(bad_request('Todos los campos son requeridos'));
        }

        const [rows] = await db_pool_conexiones.query(
            'UPDATE repuestos SET nombre = ?, compatibilidad = ?, stock = ?, precio = ? WHERE id = ?',
            [nombre, compatibilidad, stock, precio, id]
        );

        if (rows.affectedRows === 0) {
            return res.status(404).json(responses_not_found('No se encontró repuesto con el ID proporcionado'));
        }
        res.status(200).json(responses_success(null, 'Repuesto actualizado exitosamente'));
    } catch (error) {
        console.error('Error al actualizar repuesto:', error);
        res.status(500).json(responses_error('Error al actualizar repuesto -> ' + error.message));
    }
};

// ── Eliminar repuesto ─────────────────────────────────────────
export const eliminarRepuesto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID del repuesto es requerido y debe ser un número válido'));
        }

        const [rows] = await db_pool_conexiones.query('DELETE FROM repuestos WHERE id = ?', [id]);
        if (rows.affectedRows > 0) {
            res.status(200).json(responses_success(null, 'Repuesto eliminado exitosamente'));
        } else {
            res.status(404).json(responses_not_found('No se encontró repuesto con el ID proporcionado'));
        }
    } catch (error) {
        console.error('Error al eliminar repuesto:', error);
        res.status(500).json(responses_error('Error al eliminar repuesto -> ' + error.message));
    }
};