import { message } from './messages/messages'
import { user } from './users/users'
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(message)
  app.configure(user)
  // All services will be registered here
}
