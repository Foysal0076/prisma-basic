import Hapi from '@hapi/hapi'
import { Prisma } from '@prisma/client'

export const registerUserHandler = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app
  const payload = request.payload as Prisma.UserCreateInput
  if (payload.social) {
    payload.social = JSON.stringify(payload.social)
  }

  try {
    const createdUser = await prisma.user.create({
      data: payload,
    })
    return h.response(createdUser).code(201)
  } catch (error) {
    // if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //   return h.response(error.message).code(400)
    // }
    throw error
  }
}
