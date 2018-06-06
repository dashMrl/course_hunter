import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import courseRouter from './routes/course'
import { cors } from "./middleware/cors";

function main() {
    const port = 3000
    const app = express()
    app.use(morgan('short'))
    app.all('*', cors)
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/course', courseRouter)
    app.listen(port, () => {
        console.info(`Hunter listening on port ${port}!`)
    })
}

main()