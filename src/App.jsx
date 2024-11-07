import Navbar from './components/Navbar'
import Manager from './components/Manager'
import './App.css'

function App() {


  return (
    <>
      <Navbar />
      <div className='bg-pattern'>
        <Manager />
      </div>
    </>
  )
}

export default App
