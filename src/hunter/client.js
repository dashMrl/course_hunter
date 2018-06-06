import url from 'url'
import superagent from 'superagent'

const loginUrl = 'https://pass.hust.edu.cn/cas/login?service=http%3A%2F%2Fhubs.hust.edu.cn%2Fhustpass.action'
const courseUrl = 'http://hubs.hust.edu.cn/aam/score/CourseInquiry_ido.action'


class Client {
    constructor() {
        this.agent = superagent.agent()
    }
    getPage() {
        return new Promise((resolve, reject) => {
            this.agent.get(loginUrl)
                .set(
                    {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
                    })
                .end((err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res.text)
                    }
                })
        })
    }

    async login(form) {
        return new Promise((resolve, reject) => {
            this.agent.post(loginUrl)
                .set(
                    {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
                    })
                .type('form')
                .send(form)
                .redirects(2)
                .end((err, res) => {
                    if (err || !res.ok) {
                        reject(err)
                    } else {
                        resolve(true)
                    }
                })
        })
    }

    getCourses(rangeForm) {
        return new Promise((resolve, reject) => {
            this.agent.post(courseUrl)
                .set(
                    {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
                    })
                .type('form')
                .send(rangeForm)
                .end((err, res) => {
                    if (err || !res.ok) {
                        reject(err)
                    } else {
                        resolve(res.text)
                    }
                })
        })

    }

}
export {
    Client
}

