import crypto from 'crypto'
import { resolve } from '@feathersjs/schema'
import { Type, getDataValidator, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../schemas/validators'

// Main data model schema
export const userSchema = Type.Object(
  {
    id: Type.Number(),
    email: Type.String(),
    password: Type.Optional(Type.String()),
    githubId: Type.Optional(Type.Number()),
    avatar: Type.Optional(Type.String())
  },
  { $id: 'User', additionalProperties: false }
)
export type User = Static<typeof userSchema>
export const userResolver = resolve<User, HookContext>({
  properties: {}
})

export const userExternalResolver = resolve<User, HookContext>({
  properties: {
    // The password should never be visible externally
    password: async () => undefined
  }
})

// Schema for the basic data model (e.g. creating new entries)
export const userDataSchema = Type.Pick(userSchema, ['email', 'password', 'githubId', 'avatar'], {
  $id: 'UserData',
  additionalProperties: false
})
export type UserData = Static<typeof userDataSchema>
export const userDataValidator = getDataValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve<User, HookContext>({
  properties: {
    password: passwordHash({ strategy: 'local' }),
    avatar: async (value, user) => {
      // If the user passed an avatar image, use it
      if (value !== undefined) {
        return value
      }

      // Gravatar uses MD5 hashes from an email address to get the image
      const hash = crypto.createHash('md5').update(user.email.toLowerCase()).digest('hex')
      // Return the full avatar URL
      return `https://s.gravatar.com/avatar/${hash}?s=60`
    }
  }
})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, ['id', 'email', 'githubId'])
export const userQuerySchema = querySyntax(userQueryProperties)
export type UserQuery = Static<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve<UserQuery, HookContext>({
  properties: {
    // If there is a user (e.g. with authentication), they are only allowed to see their own data
    id: async (value, user, context) => {
      // We want to be able to get a list of all users but
      // only let a user modify their own data otherwise
      if (context.params.user && context.method !== 'find') {
        return context.params.user.id
      }

      return value
    }
  }
})
