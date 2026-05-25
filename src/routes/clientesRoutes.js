import { Router } from 'express';
import {
    obtenerClientes,
    obtenerClienteById,
    crearCliente,
    actualizarCliente,
    eliminarcliente
} from '../controllers/clientesController.js';

const ClientesRoutes = new Router();

clientesRoutes.get('/clientes', obtenerClientes);
clientesRoutes.get('/clientes/:id', obtenerClienteById);
clientesRoutes.post('/clientes', crearCliente);
clientesRoutes.put('/clientes/:id', actualizarCliente);
clientesRoutes.delete('/clientes/:id', eliminarcliente);

export default clientesRoutes;