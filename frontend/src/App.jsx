import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './Components/LoginForm/LoginForm';
import Crud from './Components/Crud/Crud';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={<LoginForm setLoggedIn={setLoggedIn} />}
        />
        <Route
          path='/'
          element={loggedIn ? <Crud /> : <Navigate to='/login' />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
