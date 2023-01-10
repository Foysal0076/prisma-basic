# Common commands

## _Init Prisma_

    npx init prisma

## _Hey prisma! I am done creating my schemas, Please migrate those_

    npx prisma migrate dev --name init

## _Initiate Prisma_
    npx prisma init

## _Hey prisma! I want to manually regenerate the client_

    npx prisma generate

    //use
    import { PrismaClient } from '@prisma/client'
    const prisma = new PrismaClient()

## _I want to seed my database from prisma/seed.ts file_

    //add
      "prisma": {
        "seed": "ts-node prisma/seed.ts"
      },
    in package.json first
    npx prisma db seed
