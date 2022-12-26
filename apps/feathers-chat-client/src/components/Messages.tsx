import { Paginated } from '@feathersjs/feathers/lib';
import { useEffect, useRef, useState } from 'react';
import { client } from '../feathers';
import { MessageData } from 'feathers-chat'

const formatDate = (timestamp: number) => new Intl.DateTimeFormat('en-US', {
  timeStyle: 'short',
  dateStyle: 'medium'
}).format(new Date(timestamp))

export function Messages () {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const findMessages = async () => {
      const { data } = (await client.service('messages').find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })) as any as Paginated<MessageData>
  
      setMessages(data.reverse())
    }
    
    findMessages()
  }, [])

  
  useEffect(() => {
    client.service('messages').once('created', (message: MessageData) =>
      setMessages(messages.concat(message))
    )
    
    if (messagesEndRef.current) {
      (messagesEndRef.current as any).scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])


  return <div className='h-full overflow-y-auto px-3'>
    {messages.map(({ id, text, createdAt, user }: any) => <div key={id} className="message flex flex-row pt-2 pb-3 relative transition-colors duration-300 hover:bg-base-200">
      <div className="avatar indicator">
        <div className="h-10 w-10 sm:w-12 sm:h-12 rounded"><img alt={user.email} src={user.avatar} /></div>
      </div>
      <div className="ml-2 leading-4 md:leading-5 sm:mt-1.5"><span className="font-bold">{user.email}</span>
      <small className="text-sm font-light tracking-tight ml-2">{formatDate(createdAt || Date.now())}</small>
      <p>{text}</p>
      </div>
    </div>)}
    <div ref={messagesEndRef} />
  </div>
}