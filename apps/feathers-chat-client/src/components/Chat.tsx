import { Paginated } from '@feathersjs/feathers';
import React, { useEffect, useState } from 'react';
import { UserData } from 'feathers-chat';
import { client } from '../feathers';
import { Messages } from './Messages';

export function Chat () {
  const [users, setUsers] = useState<UserData[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const logout = () => client.logout();
  const sendMessage = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    await client.service('messages').create({
      text: messageText
    });
    setMessageText('');
  }

  useEffect(() => {
    const findUsers = async () => {
      const { data } = (await client.service('users').find({})) as any as Paginated<UserData>
  
      setUsers(data)
    }
    
    findUsers()
  }, [])

  useEffect(() => {
    client.service('users').once('created', (user: any) => setUsers(users.concat(user)))
  }, [users])

  return <div className='drawer drawer-mobile'>
    <input id='drawer-left' type='checkbox' className='drawer-toggle' />
    <div className='drawer-side'><label htmlFor='drawer-left' className='drawer-overlay'></label>
      <ul className='menu compact p-2 overflow-y-auto w-60 bg-base-300 text-base-content'>
        <li className='menu-title'><span>Users</span></li>
        {users.map(user => <li key={(user as any).id}>
          <a>
            <div className='avatar indicator'>
              <div className='w-6 rounded'><img src={user.avatar} alt={user.email} /></div>
            </div><span>{user.email}</span>
          </a>
        </li>)}
      </ul>
    </div>
    <div className='drawer-content flex flex-col'>
      <div className='navbar w-full'>
        <div className='navbar-start'>
          <label htmlFor='drawer-left' className='btn btn-square btn-ghost lg:hidden drawer-button'>
            <i className='i-feather-menu text-lg'></i>
          </label>
        </div>
        <div className='navbar-center flex flex-col'>
          <p>Feathers Chat</p>
          <label htmlFor='drawer-right' className='text-xs cursor-pointer'>
            <span className='online-count'>{users.length}</span> Users
          </label>
        </div>
        <div className='navbar-end'>
          <div className='tooltip tooltip-left' data-tip='Logout'>
          <button onClick={logout} type='button' id='logout' className='btn btn-ghost'>
            <i className='i-feather-log-out text-lg'></i>
          </button>
        </div>
        </div>
      </div>
      <Messages />
      <div className='form-control w-full py-2 px-3'>
        <form onSubmit={sendMessage} className='input-group overflow-hidden'>
          <input onChange={ev => setMessageText(ev.target.value)} value={messageText} name='text' type='text' placeholder='Compose message' className='input input-bordered w-full' />
          <button type='submit' className='btn'>Send</button>
        </form>
      </div>
    </div>
  </div>
}
