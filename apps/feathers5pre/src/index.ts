import { isOdd } from 'is-odd'
import { app } from './app'
import { logger } from './logger'

const is1Odd = isOdd(1)
console.log({ is1Odd })

const port = app.get('port')
const host = app.get('host')

app.listen(port).then(() => {
  logger.info(`Feathers app listening on http://${host}:${port}`)
})
