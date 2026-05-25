import { config } from 'dotenv';

config(); // Inicializa la carga de las variables de entorno

export const PORT     = process.env.PORT     || 3200;
export const HOST_DB  = process.env.HOST_DB  || 'localhost';
export const USER_DB  = process.env.USER_DB  || 'root';
export const PASS_DB  = process.env.PASS_DB  || 'admin';
export const DATABASE = process.env.DATABASE || 'drcell';
export const PORT_DB  = process.env.PORT_DB  || 3306;

// Configuración del CORS
export const config_cors = {
    application: {
        cors: {
            server: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                credentials: true
            }
        }
    }
};