import { PrismaClient, UserRole } from '@prisma/client'
import { add } from 'date-fns'
const prisma = new PrismaClient()

const main = async () => {
  await prisma.testResult.deleteMany({})
  await prisma.courseEnrollment.deleteMany({})
  await prisma.test.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.course.deleteMany({})

  const adminUser = await prisma.user.upsert({
    create: {
      email: 'admin@email.com',
      firstName: 'admin',
      lastName: 'user',
      role: UserRole.ADMIN,
    },
    update: {
      firstName: 'admin',
      lastName: 'user',
      role: UserRole.ADMIN,
    },
    where: {
      email: 'admin@email.com',
    },
  })

  //Student user
  const studentUser1 = await prisma.user.create({
    data: {
      email: 'test@foy.com',
      firstName: 'Foysal',
      lastName: 'Ahmed',
      social: {
        facebook: 'https://www.facebook.com/diufoysal',
      },
    },
  })
  const studentUser2 = await prisma.user.create({
    data: {
      email: 'john@email.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.STUDENT,
      social: {
        facebook: 'https://www.facebook.com/johndoe',
      },
    },
  })

  const teacherUser = await prisma.user.create({
    data: {
      email: 'mark@email.com',
      firstName: 'Mark',
      lastName: 'Johnson',
      role: UserRole.TEACHER,
    },
  })
  console.log({ adminUser, studentUser1, studentUser2, teacherUser })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect()
  })
