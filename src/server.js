import express        from 'express';
import cors           from 'cors';
import { PORT, config_cors } from './config/config.js';

import auth_routes         from './routes/authRoutes.js';
import clientes_routes     from './routes/clientesRoutes.js';
import tecnicos_routes     from './routes/tecnicosRoutes.js';
import repuestos_routes    from './routes/repuestosRoutes.js';
import reparaciones_routes from './routes/reparacionesRoutes.js';
import facturas_routes     from './routes/facturasRoutes.js';

// Inicializar express
const app = express();

// Políticas de CORS
app.use(cors(config_cors.application.cors.server));

// Respuestas en formato JSON
app.use(express.json());

// Rutas
app.use('/api', auth_routes);
app.use('/api', clientes_routes);
app.use('/api', tecnicos_routes);
app.use('/api', repuestos_routes);
app.use('/api', reparaciones_routes);
app.use('/api', facturas_routes);

// Ruta no válida
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta de acceso NO válida' });
});

// Inicializar servidor
app.listen(PORT, () => {
    console.log(`Servidor DrCell iniciado en el puerto ${PORT}`);
});