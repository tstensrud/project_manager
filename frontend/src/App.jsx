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
import NewProject from './content/projects/NewProject';
import Buildings from "./content/buildings/Buildings";
import Specifications from './content/specifications/Specifications';
import UserProfile from "./content/userprofile/UserProfile";
import Admin from "./admin/Admin";
import NotFound from "./layout/NotFound";
import useToken from './login/UseToken';
import Logout from './login/Logout';



function App() {
  const [activeProject, setActiveProject] = useState();
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
                <Route path="projects" element={<Projects token={token} setToken={setToken} />} />
                <Route path="specifications" element={<Specifications token={token} setToken={setToken} />} />
                <Route path="userprofile" element={<UserProfile token={token} setToken={setToken} />} />
                <Route path="admin" element={<Admin token={token} setToken={setToken} />} />
                <Route path="newproject" element={<NewProject token={token} setToken={setToken} />} />
                <Route path="project" element={<Project token={token} setToken={setToken} />} />
                <Route path="buildings" element={<Buildings token={token} setToken={setToken} />} />
                <Route path="rooms" element={<Rooms token={token} setToken={setToken} />} />
                <Route path="ventilation" element={<Ventilation token={token} setToken={setToken} />} />
                <Route path="ventsystems" element={<VentSystems token={token} setToken={setToken} />} />
                <Route path="heating" element={<Heating token={token} setToken={setToken} />} />
                <Route path="cooling" element={<Cooling token={token} setToken={setToken} />} />
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
