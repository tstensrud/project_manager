import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from "./Layout";
import Login from "./login/Login";
import Ventilation from "./content/ventilation/Ventilation";
import VentSystems from "./content/ventsystems/VentSystems";
import Project from "./content/project/Project";
import Heating from "./content/heating/Heating";
import Cooling from "./content/cooling/Cooling";
import Rooms from "./content/rooms/Rooms";
import Projects from "./content/projects/Projects";
import Buildings from "./content/buildings/Buildings";
import Specifications from './content/specifications/Specifications';
import UserProfile from "./content/userprofile/UserProfile";
import Admin from "./admin/Admin";


function App() {


  return (
        <Router>
          <Routes>
            <Route index element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route path="project" element={<Project />}/>
              <Route path="buildings" element={<Buildings />}/>
              <Route path="specifications" element={<Specifications />}/>
              <Route path="rooms" element={<Rooms />} />
              <Route path="ventilation" element={<Ventilation />} />
              <Route path="ventsystem" element={<VentSystems />} />
              <Route path="heating" element={<Heating />} />
              <Route path="cooling" element={<Cooling />} />
              <Route path="projects" element={<Projects />}/>
              <Route path="userprofile" element={<UserProfile />}/>
              <Route path="admin" element={<Admin />}/>

            </Route>
          </Routes>
        </Router>
  ); 
}

export default App;
