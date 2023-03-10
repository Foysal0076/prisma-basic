import Boom from '@hapi/boom'
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

export const getUserHandler = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app
  const id = parseInt(request.params.id as string, 10)

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    //If no user is found, user=null; return 404
    if (!user) {
      return h.response().code(404)
    }
    return h.response(user).code(200)
  } catch (error) {
    console.log(error)
    return Boom.badImplementation()
  }
}

export const deleteUserHandler = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app
  const id = parseInt(request.params.id as string, 10)

  try {
    await prisma.user.delete({
      where: { id },
    })
    return h.response().code(204)
  } catch (error) {
    console.log(error)
    return h.response().code(500)
  }
}

export const updateUserHandler = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app
  const id = parseInt(request.params.id as string, 10)
  const payload = request.payload as Partial<Prisma.UserUpdateInput>

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: payload,
    })
    return h.response(updatedUser).code(200)
  } catch (error) {
    console.log(error)
    return h.response().code(500)
  }
}
