import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from "./Layout";
import NoAccess from "./layout/NoAccess";
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
import Specification from './content/specifications/Specification';
import NewSpec from './content/specifications/NewSpec';
import UserProfile from "./content/userprofile/UserProfile";
import Admin from "./admin/Admin";
import useToken from './login/UseToken';
import Logout from './login/Logout';
import ProtectedRoute from './login/ProtectedRoute';



function App() {

  const {token, removeToken, setToken} = useToken();

  return (
    <Router>
      <Routes>
        <Route path="logout/:uuid" element={<Logout token={removeToken}/>}/>
        <Route path="/noaccess" element={<NoAccess />} />
        {!token ? ( <Route path="/" element={<Login setToken={setToken}/>} />
        ) : (
          <>
          
            <Route path="/" element={<Layout />}>
                <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />}/>} />
                <Route path="specifications/:projectId" element={<ProtectedRoute element={<Specifications />}/>} />
                <Route path="specifications/:suid/:projectId" element={<ProtectedRoute element={<Specification />}/>} />
                <Route path="newspecification" element={<ProtectedRoute element={<NewSpec />}/>} />
                <Route path="userprofile/:uuid" element={<ProtectedRoute element={<UserProfile/>}/>} />
                <Route path="admin" element={<ProtectedRoute element={<Admin/>}/>}/>
                <Route path="newproject" element={<ProtectedRoute element={<NewProject />}/>} />
                <Route path="project/:projectId" element={<ProtectedRoute element={<Project />}/>} />
                <Route path="settings/:projectId" element={<ProtectedRoute element={<Settings />}/>} />
                <Route path="buildings/:projectId" element={<ProtectedRoute element={<Buildings/>}/>} />
                <Route path="rooms/:projectId" element={<ProtectedRoute element={<Rooms/>}/>}/>
                <Route path="ventilation/:projectId" element={<ProtectedRoute element={<Ventilation/>}/>} />
                <Route path="ventsystems/:projectId" element={<ProtectedRoute element={<VentSystems/>}/>} />
                <Route path="heating/:projectId" element={<ProtectedRoute element={<Heating/>}/>}/>
                <Route path="cooling/:projectId" element={<ProtectedRoute element={<Cooling/>}/>} />
            </Route>
            </> )}
        <Route path="*" element={<NoAccess />} />
      </Routes>
    </Router>

  ); 
}

export default App;
