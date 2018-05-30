import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import courseRouter from './routes/course'
import helloRouter from './routes/hello'


function main() {
    const port = 3000
    const app = express()
    app.use(morgan('short'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use('/course', courseRouter)
    app.use('/hello', helloRouter)
    app.listen(port, () => {
        console.log(`Hunter listening on port ${port}!`)
    })
}

main()