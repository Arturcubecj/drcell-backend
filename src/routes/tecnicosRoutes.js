import { Router } from 'express';
import { obtenerTecnicos, obtenerTecnicoId, crearTecnico, actualizarTecnico, eliminarTecnico } from '../controllers/tecnicosController.js';

const tecnicosRoutes = Router();

tecnicosRoutes.get('/tecnicos', obtenerTecnicos);
tecnicosRoutes.get('/tecnicos/:id', obtenerTecnicoId);
tecnicosRoutes.post('/tecnicos', crearTecnico);
tecnicosRoutes.put('/tecnicos/:id', actualizarTecnico);
tecnicosRoutes.delete('/tecnicos/:id', eliminarTecnico);

export default tecnicosRoutes;