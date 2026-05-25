import { createPool } from 'mysql2/promise';
import { HOST_DB, USER_DB, PASS_DB, DATABASE, PORT_DB } from '../config/config.js';

// Crear el pool de conexiones de MySQL
export const db_pool_conexiones = createPool({
    host:     HOST_DB,
    user:     USER_DB,
    password: PASS_DB,
    database: DATABASE,
    port:     PORT_DB
});