import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/password';

const ADMIN = { email: 'admin@aiexpertchat.test', password: 'Admin1234' };
const USER = { email: 'usuario@aiexpertchat.test', password: 'Usuario1234' };

async function upsertUser(email: string, password: string, role: 'ADMIN' | 'USER', name: string) {
  const password_hash = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: password_hash, role },
    create: { email, password: password_hash, role, name },
  });
  console.log(`${role} listo: ${user.email}`);
  return user;
}

async function main() {
  await upsertUser(ADMIN.email, ADMIN.password, 'ADMIN', 'Administrador');
  await upsertUser(USER.email, USER.password, 'USER', 'Usuario Demo');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
