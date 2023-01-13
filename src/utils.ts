import jwt from 'jsonwebtoken'

export const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_JWT'
export const JWT_ALGORITHM = 'HS256'

export const generateEmailToken = (email: string): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}

export const generateAuthToken = (tokenId: number) => {
  const jwtPayload = { tokenId }

  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    noTimestamp: true,
  })
}
