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
import { Provider } from 'react-redux'
// import store from './redux/store.js'
import Tours from './components/Tours.jsx'
import PlayerProfile from './components/PlayerProfile.jsx'
import Grounds from './components/Grouds.jsx'
import About_cric from './components/About_cric.jsx'
import RegisterTour from './components/RegisterTour.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './redux/store.js';

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
     {
      path:"/signup",
      element:<SignUp/>
     },
     {
      path:"/login",
      element:<Login/>
     },
     {
      path:"/Tournaments",
      element:<Tours/>
     },
     {
      path:"/profile/:id",
      element:<PlayerProfile/>
     },
     {
      path:"/grounds",
      element:<Grounds/>
     },
     {
      path:"/about",
      element:<About_cric/>
     },
     {
      path:"/register/:id",
      element:<RegisterTour/>
     }
    ]

  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
)
