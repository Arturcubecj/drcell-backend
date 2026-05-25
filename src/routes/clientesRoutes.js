import { Router } from 'express';
import {
    obtenerClientes,
    obtenerClienteById,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} from '../controllers/clientesController.js';

const ClientesRoutes = new Router();

ClientesRoutes.get('/clientes', obtenerClientes);
ClientesRoutes.get('/clientes/:id', obtenerClienteById);
ClientesRoutes.post('/clientes', crearCliente);
ClientesRoutes.put('/clientes/:id', actualizarCliente);
ClientesRoutes.delete('/clientes/:id', eliminarCliente);

export default ClientesRoutes;