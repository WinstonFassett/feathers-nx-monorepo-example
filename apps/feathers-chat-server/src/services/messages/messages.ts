import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  messageDataValidator,
  messageQueryValidator,
  messageResolver,
  messageDataResolver,
  messageQueryResolver,
  messageExternalResolver
} from './messages.schema'

import type { Application } from '../../declarations'
import { MessageService, getOptions } from './messages.class'
import { logRuntime } from '../../hooks/log-runtime'

export * from './messages.class'
export * from './messages.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const message = (app: Application) => {
  // Register our service on the Feathers application
  app.use('messages', new MessageService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service('messages').hooks({
    around: {
      all: [logRuntime, authenticate('jwt')]
    },
    before: {
      all: [
        schemaHooks.validateQuery(messageQueryValidator),
        schemaHooks.validateData(messageDataValidator),
        schemaHooks.resolveQuery(messageQueryResolver),
        schemaHooks.resolveData(messageDataResolver)
      ]
    },
    after: {
      all: [schemaHooks.resolveResult(messageResolver), schemaHooks.resolveExternal(messageExternalResolver)]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    messages: MessageService
  }
}
