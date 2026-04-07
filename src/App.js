
import { Input } from 'postcss';
import './App.css';
import InputComponent from './components/InputComponent';

function App() {
  return (
    <div className="App">
      <h1 className='text-red-500 text-xl font'>hello</h1>
      <div>
        <InputComponent 
          label="Username"
          name="username"
          placeholder="Enter your username"
        />
      </div>
    </div>
  );
}

export default App;
