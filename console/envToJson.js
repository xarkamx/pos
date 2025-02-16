require('dotenv').config()

const fs = require('fs')

const keys = Object.keys(process.env)
const env = {}
keys.filter(key => {
  const resp = key.includes("REACT_")
  return resp
}).forEach(k => {
  env[k] = process.env[k]
})


fs.writeFileSync('./src/env.json', JSON.stringify(env))