import { JSDOM } from "jsdom";
import fs from "fs";
import { createEvents } from 'ics'
import * as utils from './utils'

function parseLoginForm(html) {
    const doc = new JSDOM(html).window.document
    const inputs = doc.getElementsByTagName('input')
    let code = ''
    let lt = ''
    let execution = ''
    let eventId = ''
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const name = input.getAttribute('name')
        if (!name) {
            continue
        }
        switch (name) {
            case 'code':
                code = input.getAttribute('value')
                break;
            case 'lt':
                lt = input.getAttribute('value')
                break;
            case 'execution':
                execution = input.getAttribute('value')
                break;
            case '_eventId':
                eventId = input.getAttribute('value')
                break;
        }
    }
    if (code.length == 0 || lt.length == 0 || execution.length == 0 || eventId.length == 0) {
        return null
    }
    return {
        'code': code,
        'lt': lt,
        'execution': execution,
        '_eventId': eventId
    }
}

function courses2ics(coursesStr) {
    const events = new Array()
    const courses = parseCourses(coursesStr)
    const parseTime = (timeStr) => {
        const time = new Array()
        timeStr.slice(0, 10).split('-').forEach(s => {
            time.push(parseInt(s))
        })

        timeStr.slice(timeStr.length - 5).split(':').forEach(s => {
            time.push(parseInt(s))
        })
        return time
    }
    courses.forEach(course => {
        events.push({
            start: parseTime(course.start),
            end: parseTime(course.end),
            title: course.title,
            description: course.txt.KCMC,
            location: course.txt.JSMC,
            organizer: {
                name: course.txt.JGXM
            },
            attendees: (() => {
                const attendees = new Array()
                course.txt.KTMC.split('，').forEach(s => {
                    attendees.push(
                        {
                            name: s
                        })
                })
                return attendees
            })()
        })
    })
    return new Promise((resolve, reject) => {
        createEvents(events, (error, value) => {
            if (error) {
                reject(error)
            } else {
                resolve(value)
            }
        })
    })
}

function courses2csv(coursesStr) {
    const fields = ['Subject', 'Start Date', 'Start Time', 'End Date', 'End Time', 'All Day Event', 'Description', 'Location']
    const originCourses = parseCourses(coursesStr)
    const events = new Array()
    const createDateStr = (date) => {
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        return `${day >= 10 ? day : '0' + day}/${month >= 10 ? month : '0' + month}/${year}`
    }
    const createTimeStr = (date) => {
        const hours = date.getHours()
        const mins = date.getMinutes()
        return `${hours}:${mins >= 10 ? mins : '0' + mins} ${hours >= 12 ? 'PM' : 'AM'}`
    }
    originCourses.forEach(course => {
        const start = new Date(course.start)
        const end = new Date(course.end)
        events.push([
            course.title,
            createDateStr(start),
            createTimeStr(start),
            createDateStr(end),
            createTimeStr(end),
            course.allDay,
            `${course.txt.JGXM}:${course.txt.KTMC}`,
            course.txt.JSMC
        ])
    })
    let result = fields.toString()
    events.forEach(e => {
        result += `\n${e.toString()}`
    })
    return result
}

function courses2json(coursesStr) {
    const originCourses = parseCourses(coursesStr)
    const courses = new Array()
    originCourses.forEach(course => {
        courses.push({
            title: course.title,
            start: Date.parse(course.start),
            end: Date.parse(course.end),
            cname: course.txt.KCMC,
            teacher: course.txt.JGCM,
            location: course.txt.JSMC,
            attendees: course.txt.KTMC.split(','),
            allDay: course.allDay
        })
    })
    return courses
}

function parseCourses(coursesStr) {
    let courses = JSON.parse(coursesStr)
    courses.forEach(course => {
        course.txt = JSON.parse(course.txt.replace(/'/g, '\"'))
    });

    courses = utils.unique(courses, (e1, e2) => {
        return e1.start.toString() == e2.start.toString() &&
            e1.end.toString() == e2.end.toString() &&
            e1.txt.KCMC == e2.txt.KCMC &&
            e1.txt.JSMC == e2.txt.JSMC
    })
    return courses
}

export {
    parseLoginForm,
    courses2ics,
    courses2csv,
    courses2json
}