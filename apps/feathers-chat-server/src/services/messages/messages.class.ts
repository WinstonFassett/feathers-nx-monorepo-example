import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Message, MessageData, MessageQuery } from './messages.schema'

export interface MessageParams extends KnexAdapterParams<MessageQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class MessageService<ServiceParams extends Params = MessageParams> extends KnexService<
  Message,
  MessageData,
  ServiceParams
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'messages'
  }
}
