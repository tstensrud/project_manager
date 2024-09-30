import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

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
import Logout from './login/Logout';
import SanitaryEquipment from './content/sanitary/SanitaryEquipment';
import SanitaryShafts from './content/sanitary/SanitaryShafts';
import Sanitary from './content/sanitary/Sanitary';
import Reports from './content/reports/Reports';
import NewSystem from './content/ventsystems/NewSystem';
import CalculatorSpeedAirflowDucts from './content/calculators/CalculatorSpeedAirflowDucts';
import RegisterNewUser from './login/RegisterNewUser.jsx';
import NotFound from './layout/NotFound.jsx';

function App() {

  //const { token, removeToken, setToken } = useToken();
  const { currentUser } = useContext(AuthContext);

  const RequiredAuth = ({ children }) => {
    return (currentUser ? (children) : <Navigate to="/" />);
  }


  return (
    <Router>
      <Routes>
        <Route path="logout" element={<Logout />} />
        <Route path="noaccess" element={<NoAccess />} />
        {
          !currentUser ? (
              <Route path="/" element={<Login />} />
          ) : (
            <>
              <Route path="/" element={<Layout />}>
                <Route path="dashboard" element={<RequiredAuth><Dashboard /></RequiredAuth>} />
                <Route path="specifications/edit/:suid/:name" element={<RequiredAuth><EditSpecification /></RequiredAuth>} />
                <Route path="specifications" element={<RequiredAuth><Specifications /></RequiredAuth>} />
                <Route path="specifications/:suid/" element={<RequiredAuth><Specification /></RequiredAuth>} />
                <Route path="specifications/:suid/new_room" element={<RequiredAuth><NewRoomSpec /></RequiredAuth>} />
                <Route path="newspecification" element={<RequiredAuth><NewSpec /> </RequiredAuth>} />
                <Route path="userprofile" element={<RequiredAuth><UserProfile /></RequiredAuth>} />
                <Route path="admin" element={<RequiredAuth><Admin /> </RequiredAuth>} />
                <Route path="newproject" element={<RequiredAuth><NewProject /></RequiredAuth>} />
                <Route path="project/:projectId" element={<RequiredAuth><Project /> </RequiredAuth>} />
                <Route path="settings/:projectId" element={<RequiredAuth><Settings /> </RequiredAuth>} />
                <Route path="buildings/:projectId" element={<RequiredAuth><Buildings /></RequiredAuth>} />
                <Route path="rooms/:projectId" element={<RequiredAuth><Rooms /> </RequiredAuth>} />
                <Route path="ventilation/:projectId" element={<RequiredAuth><Ventilation /></RequiredAuth>} />
                <Route path="ventsystems/:projectId/new" element={<RequiredAuth><NewSystem /></RequiredAuth>} />
                <Route path="ventsystems/:projectId" element={<RequiredAuth><VentSystems /></RequiredAuth>} />
                <Route path="heating/:projectId" element={<RequiredAuth><Heating /></RequiredAuth>} />
                <Route path="cooling/:projectId" element={<RequiredAuth><Cooling /></RequiredAuth>} />
                <Route path="sanitary/:projectId" element={<RequiredAuth><Sanitary /></RequiredAuth>} />
                <Route path="sanitary/equipment/:projectId" element={<RequiredAuth><SanitaryEquipment /></RequiredAuth>} />
                <Route path="sanitary/shafts/:projectId" element={<RequiredAuth><SanitaryShafts /></RequiredAuth>} />
                <Route path="reports/:projectId" element={<RequiredAuth><Reports /></RequiredAuth>} />
                <Route path="calculator/ductflow" element={<RequiredAuth><CalculatorSpeedAirflowDucts /></RequiredAuth>} />
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
