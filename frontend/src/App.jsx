//import LoginForm from './Components/LoginForm/LoginForm';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Crud from './Components/Crud/Crud';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Crud />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
