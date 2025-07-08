import crypto from 'crypto'
import fs from 'fs'

const hmacKey = crypto.randomBytes(32).toString('hex')

if (fs.existsSync('.env.local')) {
  const envFile = fs.readFileSync('.env.local', 'utf8')
  // Double-check it's not already set
  if (!envFile.includes('ALTCHA_SECRET')) {
    fs.appendFileSync('.env.local', `\nALTCHA_SECRET=${hmacKey}`)
  }
  console.log(`Successfully wrote ALTCHA_SECRET to .env.local`)
} else if (fs.existsSync('.env')) {
  const envFile = fs.readFileSync('.env', 'utf8')
  // Double-check it's not already set
  if (!envFile.includes('ALTCHA_SECRET')) {
    fs.appendFileSync('.env', `\nALTCHA_SECRET=${hmacKey}`)
  }
  console.log(`Successfully wrote ALTCHA_SECRET to .env`)
} else {
  console.error('No .env/.env.local file found, please create one first.')
}