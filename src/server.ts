import dotenv from 'dotenv'
import http, { Server } from 'http'
import app from './app'
import prisma from './prisma'
dotenv.config()
const { PORT } = process.env

const server: Server = http.createServer(app)

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Server is listening on ${PORT} 🚀`))
  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

start()