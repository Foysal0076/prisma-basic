export const generateEmailToken = (email: string): string => {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}
