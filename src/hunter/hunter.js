import * as encrypt from './encryt'
import { Client } from './client'
import * as parser from './parser'
import fs from 'fs';

async function hunt(uname, pwd, start, end, encrypted) {
    const client = new Client()
    const resHome = await client.getPage()
    const form = parser.parseLoginForm(resHome)
    const en = new encrypt.Encryptor()
    form.username = encrypted ? uname : en.encrypt(uname)
    form.password = encrypted ? pwd : en.encrypt(pwd)
    await client.login(form)

    const courses = await client.getCourses({ start: start, end: end })
    return courses
}

const huntIcs = async function (uname, pwd, start, end) {
    const courses = await hunt(uname, pwd, start, end, false)
    return parser.courses2ics(courses)
}
const huntCsv = async function (uname, pwd, start, end) {
    const courses = await hunt(uname, pwd, start, end, false)
    return parser.courses2csv(courses)
}
const huntJson = async function (uname, pwd, start, end) {
    const courses = await hunt(uname, pwd, start, end, false)
    return parser.courses2json(courses)
}
export {
    huntIcs,
    huntCsv,
    huntJson
}
