# Common commands

## _Init Prisma_

    npx init prisma

## _Hey prisma! I am done creating my schemas, Please migrate those_

    npx prisma migrate dev --name init

## _Hey prisma! I want to manually regenerate the client_

    npx prisma generate

    //use
    import { PrismaClient } from '@prisma/client'
    const prisma = new PrismaClient()
