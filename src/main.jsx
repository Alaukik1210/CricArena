import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import TicketBookingForm from './components/TicketBookingForm.jsx'
import PlayerRegistrationForm from './components/PlayerRegistrationForm.jsx'
import TournamentHostingForm from './components/TournamentHostingForm.jsx'
import CricketScoreboard from './components/CricketScoreboard.jsx'
import Login from './components/Login.jsx'
import SignUp from './components/SignUp.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
      {path:"/",
        element:<App/>

      },
      {
        path:"/ticket",
        element:<TicketBookingForm/>
      },
      {
        path:"/trial",
        element:<PlayerRegistrationForm/>
      },
      {
        path:"/tournament",
        element:<TournamentHostingForm/>
      },
      {
      path:"/login",
      element:<Login/>
      },
      {
        path:"/SignUp",
        element:<SignUp/>
      },
      {
        path:"/score",
        element:<CricketScoreboard/>
      },
    ]

  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={router}/>
  </StrictMode>,
)
