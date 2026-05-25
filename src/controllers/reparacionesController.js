import { db_pool_conexiones } from '../database/db.js';
import {
    responses_success, responses_not_found,
    responses_error, responses_created, bad_request
} from '../responses/responses.js';

//  Obtener todas las reparaciones ────────────────────────────
export const obtenerReparaciones = async (req, res) => {
    try {
        const [rows] = await db_pool_conexiones.query(`
            SELECT r.id, r.codigo, c.nombre AS cliente, c.cedula,
                   u.nombre AS tecnico, r.equipo, r.nota, r.estado,
                   r.precio_servicio, r.precio_repuestos, r.total,
                   r.fecha_entrega_estimada, r.garantia_dias,
                   r.created_at, r.updated_at
            FROM reparaciones r
            INNER JOIN clientes c  ON r.cliente_id = c.id
            LEFT  JOIN tecnicos t  ON r.tecnico_id = t.id
            LEFT  JOIN usuarios u  ON t.usuario_id = u.id
        `);
        if (rows.length > 0) {
            res.status(200).json(responses_success(rows, 'Listado de reparaciones obtenido exitosamente'));
        } else {
            res.status(404).json(responses_not_found('No se encontraron reparaciones registradas'));
        }
    } catch (error) {
        console.error('Error al obtener reparaciones:', error);
        res.status(500).json(responses_error('Error al obtener reparaciones -> ' + error.message));
    }
};

//  Obtener reparación por ID ─────────────────────────────────
export const obtenerReparacionById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID de la reparación es requerido y debe ser un número válido'));
        }
        const [rows] = await db_pool_conexiones.query(`
            SELECT r.id, r.codigo, c.nombre AS cliente, c.cedula,
                   u.nombre AS tecnico, r.equipo, r.nota, r.estado,
                   r.precio_servicio, r.precio_repuestos, r.total,
                   r.fecha_entrega_estimada, r.garantia_dias,
                   r.created_at, r.updated_at
            FROM reparaciones r
            INNER JOIN clientes c  ON r.cliente_id = c.id
            LEFT  JOIN tecnicos t  ON r.tecnico_id = t.id
            LEFT  JOIN usuarios u  ON t.usuario_id = u.id
            WHERE r.id = ?
        `, [id]);
        if (rows.length > 0) {
            res.status(200).json(responses_success(rows[0], 'Reparación obtenida exitosamente'));
        } else {
            res.status(404).json(responses_not_found('No se encontró reparación con el ID proporcionado'));
        }
    } catch (error) {
        console.error('Error al obtener reparación:', error);
        res.status(500).json(responses_error('Error al obtener reparación -> ' + error.message));
    }
};

//  Obtener reparación por código (para el cliente) 
export const obtenerReparacionByCodigo = async (req, res) => {
    try {
        const { codigo } = req.params;
        if (!codigo) {
            return res.status(400).json(bad_request('El código de reparación es requerido'));
        }
        const [rows] = await db_pool_conexiones.query(`
            SELECT r.codigo, r.equipo, r.nota, r.estado,
                   r.fecha_entrega_estimada, u.nombre AS tecnico
            FROM reparaciones r
            LEFT  JOIN tecnicos t ON r.tecnico_id = t.id
            LEFT  JOIN usuarios u ON t.usuario_id = u.id
            WHERE r.codigo = ?
        `, [codigo]);
        if (rows.length > 0) {
            res.status(200).json(responses_success(rows[0], 'Reparación encontrada exitosamente'));
        } else {
            res.status(404).json(responses_not_found('No se encontró reparación con el código proporcionado'));
        }
    } catch (error) {
        console.error('Error al obtener reparación por código:', error);
        res.status(500).json(responses_error('Error al obtener reparación -> ' + error.message));
    }
};

//  Crear reparación 
export const crearReparacion = async (req, res) => {
    try {
        const {
            codigo, cliente_id, tecnico_id, equipo, nota,
            estado, precio_servicio, precio_repuestos,
            fecha_entrega_estimada, garantia_dias
        } = req.body;

        if (!codigo || !cliente_id || !equipo) {
            return res.status(400).json(bad_request('Código, cliente y equipo son requeridos'));
        }

        const [rows] = await db_pool_conexiones.query(
            `INSERT INTO reparaciones 
            (codigo, cliente_id, tecnico_id, equipo, nota, estado, precio_servicio, precio_repuestos, fecha_entrega_estimada, garantia_dias)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                codigo, cliente_id, tecnico_id || null, equipo, nota || null,
                estado || 'Pendiente',
                precio_servicio || 0, precio_repuestos || 0,
                fecha_entrega_estimada || null, garantia_dias || 30
            ]
        );
        res.status(201).json(responses_created(rows.insertId, 'Reparación creada exitosamente'));
    } catch (error) {
        console.error('Error al crear reparación:', error);
        res.status(500).json(responses_error('Error al crear reparación -> ' + error.message));
    }
};

//  Actualizar reparación 
export const actualizarReparacion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID de la reparación es requerido y debe ser un número válido'));
        }

        const {
            tecnico_id, equipo, nota, estado,
            precio_servicio, precio_repuestos,
            fecha_entrega_estimada, garantia_dias
        } = req.body;

        const [rows] = await db_pool_conexiones.query(
            `UPDATE reparaciones SET
                tecnico_id = ?, equipo = ?, nota = ?, estado = ?,
                precio_servicio = ?, precio_repuestos = ?,
                fecha_entrega_estimada = ?, garantia_dias = ?
            WHERE id = ?`,
            [
                tecnico_id || null, equipo, nota || null, estado,
                precio_servicio || 0, precio_repuestos || 0,
                fecha_entrega_estimada || null, garantia_dias || 30,
                id
            ]
        );

        if (rows.affectedRows === 0) {
            return res.status(404).json(responses_not_found('No se encontró reparación con el ID proporcionado'));
        }
        res.status(200).json(responses_success(null, 'Reparación actualizada exitosamente'));
    } catch (error) {
        console.error('Error al actualizar reparación:', error);
        res.status(500).json(responses_error('Error al actualizar reparación -> ' + error.message));
    }
};

//  Actualizar solo el estado (para técnicos) 
export const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID de la reparación es requerido y debe ser un número válido'));
        }

        const { estado } = req.body;
        const estadosValidos = ['Pendiente', 'Diagnóstico', 'En reparación', 'Control calidad', 'Lista'];
        if (!estado || !estadosValidos.includes(estado)) {
            return res.status(400).json(bad_request('Estado no válido'));
        }

        const [rows] = await db_pool_conexiones.query(
            'UPDATE reparaciones SET estado = ? WHERE id = ?',
            [estado, id]
        );

        if (rows.affectedRows === 0) {
            return res.status(404).json(responses_not_found('No se encontró reparación con el ID proporcionado'));
        }
        res.status(200).json(responses_success(null, 'Estado actualizado exitosamente'));
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json(responses_error('Error al actualizar estado -> ' + error.message));
    }
};

// Eliminar reparación 
export const eliminarReparacion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID de la reparación es requerido y debe ser un número válido'));
        }

        const [rows] = await db_pool_conexiones.query('DELETE FROM reparaciones WHERE id = ?', [id]);
        if (rows.affectedRows > 0) {
            res.status(200).json(responses_success(null, 'Reparación eliminada exitosamente'));
        } else {
            res.status(404).json(responses_not_found('No se encontró reparación con el ID proporcionado'));
        }
    } catch (error) {
        console.error('Error al eliminar reparación:', error);
        res.status(500).json(responses_error('Error al eliminar reparación -> ' + error.message));
    }
};