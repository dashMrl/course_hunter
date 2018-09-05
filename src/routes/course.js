import { Router } from "express";
import * as hunter from "../hunter/hunter";
import path from "path";
import fs from "fs";
import uuid from "uuid";

function formValidator(req, res, next) {
    const form = req.body
    if (!form.uname || !form.pwd || !form.start || !form.end) {
        res.status(400).send('No enough args...').end()
    } else {
        const unamereg = /[U|M|D]20[1|2][0-9]{6}/
        const datereg = /((((19|20)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((19|20)\d{2})-(0?[469]|11)-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-(0?[1-9]|[12]\d)))$/
        if (!unamereg.test(form.uname) || !datereg.test(form.start) || !datereg.test(form.end)) {
            res.status(400).send('Invalid args...').end()
        } else {
            next()
        }
    }
}
const router = Router()
    .post('/ics', formValidator, async (req, res) => {
        const form = req.body
        try {
            const data = await hunter.huntIcs(form.uname, form.pwd, form.start, form.end)
            const file = path.resolve('/tmp', uuid.v1())
            fs.writeFileSync(file, data)
            res.download(file, 'courses.ics')
        } catch (error) {
            console.error(error)
            if (error instanceof SyntaxError) {
                return res.sendStatus(400).end()
            } else {
                return res.sendStatus(500).end()
            }
        } finally {

        }
    })
    .post('/csv', formValidator, async (req, res) => {
        const form = req.body
        try {
            const data = await hunter.huntCsv(form.uname, form.pwd, form.start, form.end)
            const file = path.resolve('/tmp', uuid.v1())
            fs.writeFileSync(file, data)
            res.download(file, 'courses.csv')
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error(error.message)
                return res.sendStatus(400).end()
            } else {
                return res.sendStatus(500).end()
            }
        } finally {

        }
    })
    .post('/json', formValidator, async (req, res) => {
        const form = req.body
        try {
            const data = await hunter.huntJson(form.uname, form.pwd, form.start, form.end)
            res.json(data).end()
        } catch (error) {
            console.error(error)
            if (error instanceof SyntaxError) {
                return res.sendStatus(400).end()
            } else {
                return res.sendStatus(500).end()
            }
        } finally {

        }
    })

export default router