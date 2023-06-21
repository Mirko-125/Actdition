import { Route, Routes, useState, useEffect} from "react-router-dom"

import Title from "./pages/Title"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

import Actor from "./pages/Actor"
import CastingDirector from "./pages/CastingDirector"
import Producer from "./pages/Producer"

import UIActor from "./pages/UIActor"
import UICD from "./pages/UICD"
import UIProducer from "./pages/UIProducer"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Obrisi from "./pages/Obrisi"
import AddActorRole from "./pages/AddActorRole"
import AddFilmAndRoles from "./pages/AddFilmAndRoles"
import Pregled from "./pages/Pregled"
import Inbox from "./pages/Inbox"

function App() 
{
  return (
    <>
      <Navbar/>
      <div className="wrapper">
      <div className="container">
        <Routes>
          <Route path="/Inbox" element={<Inbox/>}/>
          <Route path="/Pregled" element={<Pregled/>}/>
          <Route path="/AddActorRole" element={<AddActorRole/>}/>
          <Route path="/AddFilmAndRoles" element={<AddFilmAndRoles/>}/>
          <Route path="/" element={<Title />} />
          <Route path="/Obrisi" element={<Obrisi/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Actor" element={<Actor />} />
          <Route path="/CastingDirector" element={<CastingDirector />} />
          <Route path="/Producer" element={<Producer />} />
          <Route path="/UIActor" element={<UIActor/>} />
          <Route path="/UICD" element={<UICD/>}/>
          <Route path="/UIProducer" element={<UIProducer/>}/>
        </Routes>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default App