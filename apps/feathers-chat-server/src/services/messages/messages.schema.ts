import { resolve } from '@feathersjs/schema'
import { Type, getDataValidator, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../schemas/validators'
import { userSchema } from '../users/users.schema'

// Main data model schema
export const messageSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String(),
    createdAt: Type.Number(),
    userId: Type.Number(),
    user: Type.Ref(userSchema)
  },
  { $id: 'Message', additionalProperties: false }
)
export type Message = Static<typeof messageSchema>
export const messageResolver = resolve<Message, HookContext>({
  properties: {
    user: async (_value, message, context) => {
      // Associate the user that sent the message
      return context.app.service('users').get(message.userId)
    }
  }
})

export const messageExternalResolver = resolve<Message, HookContext>({
  properties: {}
})

// Schema for creating new entries
export const messageDataSchema = Type.Pick(messageSchema, ['text'], {
  $id: 'MessageData',
  additionalProperties: false
})
export type MessageData = Static<typeof messageDataSchema>
export const messageDataValidator = getDataValidator(messageDataSchema, dataValidator)
export const messageDataResolver = resolve<Message, HookContext>({
  properties: {
    userId: async (_value, _message, context) => {
      // Associate the record with the id of the authenticated user
      return context.params.user.id
    },
    createdAt: async () => {
      return Date.now()
    }
  }
})

// Schema for allowed query properties
export const messageQueryProperties = Type.Pick(messageSchema, ['id', 'text', 'createdAt', 'userId'], {
  additionalProperties: false
})
export const messageQuerySchema = querySyntax(messageQueryProperties)
export type MessageQuery = Static<typeof messageQuerySchema>
export const messageQueryValidator = getValidator(messageQuerySchema, queryValidator)
export const messageQueryResolver = resolve<MessageQuery, HookContext>({
  properties: {
    userId: async (value, user, context) => {
      // We want to be able to get a list of all messages but
      // only let a user access their own messages otherwise
      if (context.params.user && context.method !== 'find') {
        return context.params.user.id
      }

      return value
    }
  }
})
