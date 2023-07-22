import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Company } from './Components/Company/company';
import { Details } from './Components/Details/details';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Company />}></Route>
      <Route path='/details' element={<Details />}></Route>
    </Routes>
  );
}

export default App;
