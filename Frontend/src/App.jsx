import axios from 'axios'
import { useEffect, useState } from 'react'
import { Navbar , Logout, Footer} from './components'
import { Routes,Route } from 'react-router-dom'
import { Home,Advisory,Itenary,Profile} from './pages'
import { useSelector, useDispatch } from 'react-redux'
import { toggle } from './redux/slice/toggler'

function App() {
  const isloggedin = useSelector((state) => state.toggle) // Fix here
  const dispatch = useDispatch()
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/logout" element={<Logout />} />
              
      </Routes>
  )
  return (
    <>
      <Navbar/>

      <div className="">
        {routes}
      </div>

        <Footer/>
    </>
  )
}

export default App
