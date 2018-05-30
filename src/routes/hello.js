import { Router } from "express";
const router = Router()
    .post('/', (req, res) => {
        res.json({
            msg: 'hello'
        })
    })
    .delete('/', (req, res) => {
        res.json({
            msg: 'hello'
        })
    })
    .put('/', (res, req) => {
        res.json({
            msg: 'hello'
        })
    })
    .get('/', (req, res) => {
        res.json({
            msg: 'hello'
        })
    })

export default router