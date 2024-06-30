import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from "./Layout";
import Login from "./login/Login";
import Ventilation from "./content/ventilation/Ventilation";
import VentSystems from "./content/ventsystems/VentSystems";
import Project from "./content/project/Project";
import Settings from "./content/project/Settings";
import Heating from "./content/heating/Heating";
import Cooling from "./content/cooling/Cooling";
import Rooms from "./content/rooms/Rooms";
import Dashboard from "./content/projects/Dashboard";
import NewProject from './content/projects/NewProject';
import Buildings from "./content/buildings/Buildings";
import Specifications from './content/specifications/Specifications';
import UserProfile from "./content/userprofile/UserProfile";
import Admin from "./admin/Admin";
import NotFound from "./layout/NotFound";
import useToken from './login/UseToken';
import Logout from './login/Logout';



function App() {

  const {token, removeToken, setToken} = useToken();
  
  return (

    
    <Router>
      
      <Routes>
        <Route path="logout" element={<Logout token={removeToken}/>}/>
        {
        !token && token !== "" && token !== undefined ? 
        (
          <Route path="/" element={<Login setToken={setToken}/>} />
        ) : (

            <Route path="/" element={<Layout />}>
              <>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="specifications" element={<Specifications />} />
                <Route path="userprofile/:userId" element={<UserProfile  />} />
                <Route path="admin" element={<Admin  />} />
                <Route path="newproject" element={<NewProject />} />
                <Route path="project/:projectId" element={<Project />} />
                <Route path="settings/:projectId" element={<Settings />} />
                <Route path="buildings/:projectId" element={<Buildings  />} />
                <Route path="rooms/:projectId" element={<Rooms  />} />
                <Route path="ventilation/:projectId" element={<Ventilation  />} />
                <Route path="ventsystems/:projectId" element={<VentSystems  />} />
                <Route path="heating/:projectId" element={<Heating />} />
                <Route path="cooling/:projectId" element={<Cooling  />} />
              </>
            </Route>
        )
        }
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>

  ); 
}

export default App;
