import 'dotenv/config'
import express, { json } from "express"
import cors from "cors"
// import Token from './middleware/Token'

// Initializing or Starting Express Server
const app = express()

// CORS Middleware and enable body-parser
const corsOptions = {
    origin: '*',
    methods: "GET, POST, PUT, PATCH, DELETE",
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(json())
// app.use(Token.verify)

app.get('/', (request, response) => {
    response.send({ app: 'welcome to task api dev', version: '0.0.1' })
})

// Server Listening
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> console.log(`Server Running on port: ${PORT}`))
