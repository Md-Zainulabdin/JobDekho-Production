import express from 'express'
import cors from "cors" // -> Cross-Origin Resource Sharing


const app = express()

// Configure Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Import Routes
import authRouter from "./routes/auth.routes.mjs"
import userRouter from "./routes/user.routes.mjs"
import companyRouter from "./routes/company.routes.mjs"

app.get('/helloworld', (req, res) => {
    res.send("Hello World")
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/company', companyRouter)

export { app }