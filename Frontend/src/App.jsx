import axios from 'axios'
import { useEffect, useState } from 'react'
import { Navbar } from './components'
import { Routes,Route } from 'react-router-dom'
import { Home,Advisory,Itenary,Profile} from './pages'


function App() {
  const [jokes, setJokes] = useState(0)

  useEffect(() => {
    axios.get('/api/jokes')
      .then((res) => {
        setJokes(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  },[]) // Empty dependency array to run only once on mount

  const routes = (
      <Routes>
          		<Route path='/' element={<Home/>}></Route>
          		<Route path='/itenary' element={<Itenary/>}></Route>
          		<Route path='/advisory' element={<Advisory/>}></Route>
              <Route path='/profile' element={<Profile/>}></Route>
      </Routes>
  )
  return (
    <>
      <Navbar/>

      <div className="flex justify-center items-center h-1/2 text-6xl pt-30 pb-20">
        {routes}
      </div>
      
      <div className="flex justify-center items-center h-1/2 text-6xl pt-30 pb-20 text-red-700">
        {jokes.length > 0 ? (jokes[0].title):("")}   {/* Render title only if there is at least one joke */}
      </div>
    </>
  )
}

export default App
