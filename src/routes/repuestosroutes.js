import { Router } from 'express';
import { obtenerRepuestos, obtenerRepuestoById, crearRepuesto, actualizarRepuesto, eliminarRepuesto } from '../controllers/repuestosController.js';


const repuestos_routes = new Router();
repuestos_routes.get('/repuestos',        obtenerRepuestos);
repuestos_routes.get('/repuestos/:id',    obtenerRepuestoById);
repuestos_routes.post('/repuestos',       crearRepuesto);
repuestos_routes.put('/repuestos/:id',    actualizarRepuesto);
repuestos_routes.delete('/repuestos/:id', eliminarRepuesto);


export default repuestos_routes;