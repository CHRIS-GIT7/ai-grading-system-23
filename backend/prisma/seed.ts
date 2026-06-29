import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.lecturer.upsert({
    where: { email: 'admin@lcu.edu.ng' },
    update: {},
    create: {
      email: 'admin@lcu.edu.ng',
      password: 'password123',
      name: 'Admin Lecturer',
      department: 'Computer Science'
    }
  });

  const student = await prisma.student.upsert({
    where: { matric: 'LCU/19/0001' },
    update: {},
    create: {
      matric: 'LCU/19/0001',
      password: 'password123',
      name: 'John Doe',
      department: 'Computer Science',
      email: 'johndoe@student.lcu.edu.ng',
      level: '400L'
    }
  });

  // Add some sample courses for the lecturer
  const course1 = await prisma.course.upsert({
    where: { code: 'CSC101' },
    update: {},
    create: {
      code: 'CSC101',
      title: 'Introduction to Computer Science',
      credits: 3,
      lecturerId: admin.id,
      semester: 'First'
    }
  });

  const course2 = await prisma.course.upsert({
    where: { code: 'CSC201' },
    update: {},
    create: {
      code: 'CSC201',
      title: 'Data Structures',
      credits: 3,
      lecturerId: admin.id,
      semester: 'Second'
    }
  });

  const course3 = await prisma.course.upsert({
    where: { code: 'CSC301' },
    update: {},
    create: {
      code: 'CSC301',
      title: 'Algorithms',
      credits: 3,
      lecturerId: admin.id,
      semester: 'First'
    }
  });

  console.log('Database seeded:', { admin, student, course1, course2, course3 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
