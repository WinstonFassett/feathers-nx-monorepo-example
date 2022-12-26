import React, { useState, useEffect } from 'react';
import { Chat } from './components/Chat';

import { Login } from './components/Login';
import { client } from './feathers';
import { UserData } from 'feathers-chat/lib/client'

function App() {
  const [user, setUser] = useState<UserData|null>(null)
  
  useEffect(() => {
    client.on('login', ({ user }: { user: UserData }) => setUser(user));
    client.on('logout', () => setUser(null));
    client.reAuthenticate();
  }, []);

  return (
    <div id='app' data-theme='light'>
      {user ? <Chat /> : <Login />}
    </div>
  );
}

export default App;
