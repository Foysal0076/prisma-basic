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

  //Creating course and related tests
  const weekFromNow = add(new Date(), { days: 7 })
  const twoWeekFromNow = add(new Date(), { days: 14 })
  const monthFromNow = add(new Date(), { days: 30 })

  const courses = await prisma.course.create({
    data: {
      name: 'Prisma with Postgres',
      courseDetails: 'Learn how to use Prisma with Postgres',
      tests: {
        create: [
          {
            name: 'Prisma with Postgres Test 1',
            date: weekFromNow,
          },
          {
            name: 'Prisma with Postgres Test 2',
            date: twoWeekFromNow,
          },
          {
            name: 'Prisma with Postgres Test 3',
            date: monthFromNow,
          },
        ],
      },
    },
    include: {
      tests: true,
    },
  })

  const testResultFoy = [82, 74, 91]
  const testResultJohn = [90, 94, 91]

  let counter = 0
  for (const test of courses.tests) {
    await prisma.testResult.create({
      data: {
        test: {
          connect: { id: test.id },
        },
        grader: {
          connect: { email: teacherUser.email },
        },
        student: {
          connect: { email: studentUser1.email },
        },
        result: testResultFoy[counter],
      },
    })

    await prisma.testResult.create({
      data: {
        test: {
          connect: { id: test.id },
        },
        grader: {
          connect: { email: teacherUser.email },
        },
        student: {
          connect: { email: studentUser2.email },
        },
        result: testResultJohn[counter],
      },
    })
    counter++
  }

  //Get aggregate result of Foysal Ahmed
  const aggregateResult1 = await prisma.testResult.aggregate({
    where: {
      student: { email: studentUser1.email },
    },
    _avg: { result: true },
    _max: { result: true },
    _min: { result: true },
    _sum: { result: true },
    _count: true,
  })

  console.log("Foy's  result: ", aggregateResult1)

  const aggregateResult2 = await prisma.testResult.aggregate({
    where: {
      student: { email: studentUser2.email },
    },
    _avg: { result: true },
    _max: { result: true },
    _min: { result: true },
    _sum: { result: true },
    _count: true,
  })

  console.log("John's  result: ", aggregateResult2)
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
