import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

// El parámetro `?schema=` en la cadena de conexión solo lo entiende el motor
// de migraciones de Prisma; el driver `pg` (usado en runtime por el
// adapter) lo ignora y por defecto apunta a "public". Por eso el esquema
// ("ai_expert_chat") se pasa aquí explícitamente, como segundo argumento.
const adapter = new PrismaPg({ connectionString }, { schema: 'ai_expert_chat' });
const prisma = new PrismaClient({ adapter });

export { prisma };
