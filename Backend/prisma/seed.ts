import { PrismaClient, Role, ProjectStatus, EnrollmentStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Lista base de carreras (el admin puede agregar/editar/eliminar después).
const CARRERAS_BASE = [
  'Ingeniería en Software',
  'Ingeniería en Sistemas Computacionales',
  'Ingeniería en Computación',
  'Ingeniería en Tecnologías de la Información',
  'Ingeniería Industrial',
  'Ingeniería Mecatrónica',
  'Ingeniería Civil',
  'Ingeniería Electrónica',
  'Licenciatura en Administración',
  'Licenciatura en Diseño Gráfico',
  'Licenciatura en Mercadotecnia',
  'Licenciatura en Contaduría',
];

// Siembra el catálogo de carreras de forma idempotente.
async function seedCarreras() {
  for (const nombre of CARRERAS_BASE) {
    await prisma.carrera.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }
  console.log(`✅ Catálogo de carreras listo (${CARRERAS_BASE.length} base).`);
}

// Siembra estados y municipios (datos INEGI) solo si aún no existen.
async function seedEstadosMunicipios() {
  const existing = await prisma.estado.count();
  if (existing > 0) {
    console.log(`ℹ️ Estados/municipios ya sembrados (${existing} estados). Se omite.`);
    return;
  }

  const dataPath = path.join(__dirname, 'data', 'estados-municipios.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data: Record<string, string[]> = JSON.parse(raw);

  let totalMunicipios = 0;
  for (const [estadoNombre, municipios] of Object.entries(data)) {
    const estado = await prisma.estado.create({ data: { nombre: estadoNombre } });
    await prisma.municipio.createMany({
      data: municipios.map((nombre) => ({ nombre, estadoId: estado.id })),
      skipDuplicates: true,
    });
    totalMunicipios += municipios.length;
  }
  console.log(`✅ INEGI sembrado: ${Object.keys(data).length} estados, ${totalMunicipios} municipios.`);
}

async function main() {
  console.log('🌱 Iniciando la siembra de datos...');

  // Encriptamos la contraseña para que el login funcione sin broncas
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 1. Creamos a tu Superusuario Administrador
  const admin = await prisma.user.upsert({
    where: { email: 'admin@labsol.mx' },
    update: {},
    create: {
      email: 'admin@labsol.mx',
      password: hashedPassword,
      name: 'Super Admin',
      role: Role.administrator,
      isBaseAdmin: true,
      isActive: true,
    },
  });
  console.log(`✅ Admin maestro listo: ${admin.email}`);

  // 2. Creamos un Solicitante (Empresa/Investigador)
  const solicitante = await prisma.user.upsert({
    where: { email: 'contacto@techsolutions.com' },
    update: {},
    create: {
      email: 'contacto@techsolutions.com',
      password: hashedPassword,
      name: 'Carlos Ruiz',
      role: Role.solicitante,
      company: 'Tech Solutions Integrators',
      jobTitle: 'Director de Innovación',
      activity: 'Desarrollo de hardware y software',
    },
  });
  console.log(`✅ Solicitante listo: ${solicitante.email}`);

  // 3. Creamos un Estudiante de prueba
  const estudiante = await prisma.user.upsert({
    where: { email: 'emiliano@uaz.edu.mx' },
    update: {},
    create: {
      email: 'emiliano@uaz.edu.mx',
      password: hashedPassword,
      name: 'Emiliano De Santiago',
      role: Role.estudiante,
      academicInstitution: 'UAZ',
      career: 'Ingeniería en Software',
      municipality: 'Zacatecas',
    },
  });
  console.log(`✅ Estudiante listo: ${estudiante.email}`);

  // 4. Creamos un Proyecto de prueba vinculado al Solicitante
  const proyecto = await prisma.project.create({
    data: {
      title: 'Project Polaris - Sistema de Gestión',
      abstract: 'Plataforma para la administración integral de recursos.',
      description: 'Desarrollo de un sistema de gestión utilizando Django para el backend, React en el frontend, y almacenamiento escalable con PostgreSQL y MinIO.',
      category: 'Desarrollo Web y Arquitectura',
      status: ProjectStatus.en_revision,
      requiredSkills: ['React', 'Django', 'PostgreSQL', 'Docker'],
      timeline: '4 meses',
      studentLimit: 3,
      solicitanteId: solicitante.id,
    },
  });
  console.log(`✅ Proyecto de prueba creado: ${proyecto.title}`);

  // 5. Inscribimos al estudiante en el proyecto para probar relaciones
  await prisma.enrollment.create({
    data: {
      studentId: estudiante.id,
      projectId: proyecto.id,
      status: EnrollmentStatus.pendiente,
    },
  });
  console.log(`✅ Inscripción generada para probar el dashboard.`);

  // 6. Catálogos: carreras (CRUD admin) y estados/municipios (INEGI).
  await seedCarreras();
  await seedEstadosMunicipios();

  console.log('🚀 ¡Sembrado completado con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
