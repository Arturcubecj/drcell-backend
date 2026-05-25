import { Router } from 'express';
import { obtenerReparaciones, obtenerReparacionById, obtenerReparacionByCodigo, crearReparacion, actualizarReparacion, actualizarEstado, eliminarReparacion } from '../controllers/reparacionesController.js';

const reparacionesRoutes = new Router();

reparacionesRoutes.get('/reparaciones', obtenerReparaciones);
reparacionesRoutes.get('/reparaciones/codigo/:codigo', obtenerReparacionByCodigo);
reparacionesRoutes.get('/reparaciones/:id', obtenerReparacionById);
reparacionesRoutes.post('/reparaciones', crearReparacion);
reparacionesRoutes.put('/reparaciones/:id', actualizarReparacion);
reparacionesRoutes.patch('/reparaciones/:id/estado', actualizarEstado);
reparacionesRoutes.delete('/reparaciones/:id', eliminarReparacion);

export default reparacionesRoutes;