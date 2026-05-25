import { db_pool_conexiones } from '../database/db.js';
import { responses_success, responses_not_found, responses_error, responses_created, bad_request } from '../responses/responses.js';

// Obtener todas las facturas
export const obtenerFacturas = async (req, res) => {
    try {
        const [rows] = await db_pool_conexiones.query(`
            SELECT f.id, f.fecha_emision, f.subtotal, f.impuesto, f.total,
                   f.observaciones, r.codigo AS reparacion,
                   c.nombre AS cliente, c.cedula
            FROM facturas f
            INNER JOIN reparaciones r ON f.reparacion_id = r.id
            INNER JOIN clientes c     ON r.cliente_id = c.id
        `);
        if (rows.length > 0) {
            res.status(200).json(responses_success(rows, 'Listado de facturas obtenido exitosamente'));
        } else {
            res.status(404).json(responses_not_found('No se encontraron facturas registradas'));
        }
    } catch (error) {
        console.error('Error al obtener facturas:', error);
        res.status(500).json(responses_error('Error al obtener facturas -> ' + error.message));
    }
};

// Obtener factura por ID
export const obtenerFacturaById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID de la factura es requerido y debe ser un número válido'));
        }
        const [rows] = await db_pool_conexiones.query(`
            SELECT f.id, f.fecha_emision, f.subtotal, f.impuesto, f.total,
                   f.observaciones, r.codigo AS reparacion,
                   c.nombre AS cliente, c.cedula,
                   r.equipo, r.precio_servicio, r.precio_repuestos,
                   r.garantia_dias
            FROM facturas f
            INNER JOIN reparaciones r ON f.reparacion_id = r.id
            INNER JOIN clientes c     ON r.cliente_id = c.id
            WHERE f.id = ?
        `, [id]);
        if (rows.length > 0) {
            res.status(200).json(responses_success(rows[0], 'Factura obtenida exitosamente'));
        } else {
            res.status(404).json(responses_not_found('No se encontró factura con el ID proporcionado'));
        }
    } catch (error) {
        console.error('Error al obtener factura:', error);
        res.status(500).json(responses_error('Error al obtener factura -> ' + error.message));
    }
};

// Obtener factura por reparación
export const obtenerFacturaByReparacion = async (req, res) => {
    try {
        const { reparacion_id } = req.params;
        if (!reparacion_id || isNaN(reparacion_id)) {
            return res.status(400).json(bad_request('El ID de la reparación es requerido y debe ser un número válido'));
        }
        const [rows] = await db_pool_conexiones.query(`
            SELECT f.id, f.fecha_emision, f.subtotal, f.impuesto, f.total,
                   f.observaciones, r.codigo AS reparacion,
                   c.nombre AS cliente, c.cedula,
                   r.equipo, r.precio_servicio, r.precio_repuestos,
                   r.garantia_dias
            FROM facturas f
            INNER JOIN reparaciones r ON f.reparacion_id = r.id
            INNER JOIN clientes c     ON r.cliente_id = c.id
            WHERE f.reparacion_id = ?
        `, [reparacion_id]);
        if (rows.length > 0) {
            res.status(200).json(responses_success(rows[0], 'Factura obtenida exitosamente'));
        } else {
            res.status(404).json(responses_not_found('No se encontró factura para esta reparación'));
        }
    } catch (error) {
        console.error('Error al obtener factura por reparación:', error);
        res.status(500).json(responses_error('Error al obtener factura -> ' + error.message));
    }
};

// Crear factura 
export const crearFactura = async (req, res) => {
    try {
        const { reparacion_id, subtotal, impuesto, observaciones } = req.body;

        if (!reparacion_id || subtotal === undefined) {
            return res.status(400).json(bad_request('Reparación y subtotal son requeridos'));
        }

        // Verificar que la reparación existe
        const [reparacion] = await db_pool_conexiones.query(
            'SELECT id FROM reparaciones WHERE id = ?', [reparacion_id]
        );
        if (reparacion.length === 0) {
            return res.status(404).json(responses_not_found('No se encontró la reparación indicada'));
        }

        // Verificar que no tenga ya una factura
        const [facturaExistente] = await db_pool_conexiones.query(
            'SELECT id FROM facturas WHERE reparacion_id = ?', [reparacion_id]
        );
        if (facturaExistente.length > 0) {
            return res.status(400).json(bad_request('Esta reparación ya tiene una factura generada'));
        }

        const [rows] = await db_pool_conexiones.query(
            'INSERT INTO facturas (reparacion_id, subtotal, impuesto, observaciones) VALUES (?, ?, ?, ?)',
            [reparacion_id, subtotal, impuesto || 0, observaciones || null]
        );
        res.status(201).json(responses_created(rows.insertId, 'Factura creada exitosamente'));
    } catch (error) {
        console.error('Error al crear factura:', error);
        res.status(500).json(responses_error('Error al crear factura -> ' + error.message));
    }
};

// Eliminar factura ──────────────────────────────────────────
export const eliminarFactura = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json(bad_request('El ID de la factura es requerido y debe ser un número válido'));
        }

        const [rows] = await db_pool_conexiones.query('DELETE FROM facturas WHERE id = ?', [id]);
        if (rows.affectedRows > 0) {
            res.status(200).json(responses_success(null, 'Factura eliminada exitosamente'));
        } else {
            res.status(404).json(responses_not_found('No se encontró factura con el ID proporcionado'));
        }
    } catch (error) {
        console.error('Error al eliminar factura:', error);
        res.status(500).json(responses_error('Error al eliminar factura -> ' + error.message));
    }
};