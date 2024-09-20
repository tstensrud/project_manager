import { HashRouter as Router, Route, Routes } from 'react-router-dom';

// Components
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
import EditSpecification from './content/specifications/EditSpecification';
import Specifications from './content/specifications/Specifications';
import Specification from './content/specifications/Specification';
import NewRoomSpec from './content/specifications/NewRoomSpec';
import NewSpec from './content/specifications/NewSpec';
import UserProfile from "./content/userprofile/UserProfile";
import Admin from "./admin/Admin";
import useToken from './login/UseToken';
import Logout from './login/Logout';
import ProtectedRoute from './login/ProtectedRoute';
import SanitaryEquipment from './content/sanitary/SanitaryEquipment';
import SanitaryShafts from './content/sanitary/SanitaryShafts';
import Sanitary from './content/sanitary/Sanitary';
import Reports from './content/reports/Reports';
import NewSystem from './content/ventsystems/NewSystem';
import CalculatorSpeedAirflowDucts from './content/calculators/CalculatorSpeedAirflowDucts';
import RegisterNewUser from './login/RegisterNewUser.jsx';
import NotFound from './layout/NotFound.jsx';

function App() {

  const { token, removeToken, setToken } = useToken();
  
  return (
    <Router>
      <Routes>
        <Route path="/logout/:uuid" element={<Logout token={removeToken} />} />
        <Route path="noaccess" element={<NoAccess />} />
        {
          !token ? (
            <Route path="/" element={<Login setToken={setToken} />} />
          ) : (
            <>
            <Route path="/" element={<Layout />}>
              <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="specifications/edit/:suid/:name" element={<ProtectedRoute element={<EditSpecification />} />} />
              <Route path="specifications" element={<ProtectedRoute element={<Specifications />} />} />
              <Route path="specifications/:suid/" element={<ProtectedRoute element={<Specification />} />} />
              <Route path="specifications/:suid/new_room" element={<ProtectedRoute element={<NewRoomSpec />} />} />
              <Route path="newspecification" element={<ProtectedRoute element={<NewSpec />} />} />
              <Route path="userprofile" element={<ProtectedRoute element={<UserProfile />} />} />
              <Route path="admin" element={<ProtectedRoute element={<Admin />} />} />
              <Route path="newproject" element={<ProtectedRoute element={<NewProject />} />} />
              <Route path="project/:projectId" element={<ProtectedRoute element={<Project />} />} />
              <Route path="settings/:projectId" element={<ProtectedRoute element={<Settings />} />} />
              <Route path="buildings/:projectId" element={<ProtectedRoute element={<Buildings />} />} />
              <Route path="rooms/:projectId" element={<ProtectedRoute element={<Rooms />} />} />
              <Route path="ventilation/:projectId" element={<ProtectedRoute element={<Ventilation />} />} />
              <Route path="ventsystems/:projectId/new" element={<ProtectedRoute element={<NewSystem />} />} />
              <Route path="ventsystems/:projectId" element={<ProtectedRoute element={<VentSystems />} />} />
              <Route path="heating/:projectId" element={<ProtectedRoute element={<Heating />} />} />
              <Route path="cooling/:projectId" element={<ProtectedRoute element={<Cooling />} />} />
              <Route path="sanitary/:projectId" element={<ProtectedRoute element={<Sanitary />} />} />
              <Route path="sanitary/equipment/:projectId" element={<ProtectedRoute element={<SanitaryEquipment />} />} />
              <Route path="sanitary/shafts/:projectId" element={<ProtectedRoute element={<SanitaryShafts />} />} />
              <Route path="reports/:projectId" element={<ProtectedRoute element={<Reports />} />} />
              <Route path="calculator/ductflow" element={<ProtectedRoute element={<CalculatorSpeedAirflowDucts />}/>}/>
              <Route path="*" element={<NotFound />} />
            </Route>
          </>
          )
        }
        <Route path="register/:uuid" element={<RegisterNewUser />} />
        <Route path="*" element={<NoAccess />} />
      </Routes>
    </Router>

  );
}

export default App;
