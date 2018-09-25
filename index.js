const say = require('say')
const got = require('got')
const moment = require('moment')

const query = process.argv[2] || 'bitcoin'

const listToRead = [`Looking for ${query}`]

const addItem = (item) => {
    const date = moment(item.date_published)
    const day = date.format('MMMM D')
    const hour =  date.format('hA')

    addText(`'on ${day} --- ${hour} --- ${item.title}`)
}

const addText = (text) => listToRead.push(text)

const readNext = () => {
    if (listToRead.length > 0) {
        say.speak(listToRead.shift(), 'Samantha', 1, waitAndReadNext)
    } else {
        say.speak('Fim', 'Luciana', 1)
    }
}

const waitAndReadNext = () => setTimeout(readNext, 2000)

got
    .get(`https://hnrss.org/newest.jsonfeed?q=${query}&count=50`)
    .then(res => res.body)
    .then(JSON.parse)
    .then(data => data.items.map(addItem))
    .then(readNext)
    .catch(e => console.log('error: ', e.message))
