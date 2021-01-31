import express, { Express } from 'express'
import { generalErrorHandler } from './errors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import hpp from 'hpp'
import routes from './routes'

const app: Express = express()
const logger = morgan('dev')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(hpp())
app.use(helmet())
app.use(cors())
app.use(logger)
app.use('/images', express.static('images'))
app.use(routes)

app.use(generalErrorHandler)

export default app
