import FauxMo from 'fauxmojs'
import express from 'express'
import http from 'http'
import path from 'path'
import { exec } from 'child_process'

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 2002

// Creates the website server on the port #
server.listen(port, function () {
  console.log('Server listening at port %d', port)
})

// configure Express
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'html')

// Express Routing
app.use(express.static(path.join(__dirname, '/public')))
app.engine('html', require('ejs').renderFile)

const sendCommand = (command) => {
  console.log(command)
  exec('irsend SEND_ONCE ollehtv ' + command)
}

const sleep = (ms = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// WEMO virtual device
const fauxMo = new FauxMo({
  devices: [
    {
      name: 'tv',
      port: 11000,
      handler: (action) => {
        console.log('tv action:', action)
        sendCommand('KEY_SETTOPPOWER')
      }
    }
  ]
})

app.get('/', (req, res) => {
  return res.render('index')
})

// Handles the route for echo apis
app.get('/api/remocon', (req, res) => {
  console.log(req.query.commands)
  const commands = req.query.commands.split(',')
  commands.forEach(async command => {
    sendCommand(command)
    await sleep(200)
  })
  return res.status(200).end()
})
