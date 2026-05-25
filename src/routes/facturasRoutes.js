import { Router } from 'express';
import { obtenerFacturas, obtenerFacturaById, obtenerFacturaByReparacion, crearFactura, eliminarFactura } from '../controllers/facturasController.js';
const facturasRoutes = new Router();

facturasRoutes.get('/facturas', obtenerFacturas);
facturasRoutes.get('/facturas/:id', obtenerFacturaById);
facturasRoutes.get('/facturas/reparacion/:reparacion_id', obtenerFacturaByReparacion);
facturasRoutes.post('/facturas', crearFactura);
facturasRoutes.delete('/facturas/:id', eliminarFactura);

export default facturasRoutes;