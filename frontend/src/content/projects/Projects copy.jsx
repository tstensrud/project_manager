import { useState, useEffect } from 'react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import axios from 'axios';
import SelectComponent from '../../formcomponents/SelectComponent';

function Projects(props) {
  
  useEffect(() => {
    fetchProjects();
  }, []);

    const [projects, setProjects] = useState([])
    
    const fetchProjects = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: "http://127.0.0.1:5000/projects/",
          headers: {
            Authorization: 'Bearer ' + props.token
          }
        });
  
        const res = response.data;
        
        if (res.access_token) {
          props.setToken(res.access_token);
        }
        
        setProjects(res.message);
  
        return res.message;
      } catch (error) {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else {
          console.log(error.message);
        }
      }
    };

    return (
      <>
        <SubTitleComponent>
          Prosjekter
        </SubTitleComponent>

        {projects}

        <form className="custom-form profile-form" method="POST" role="form">
          <p>
            <SelectComponent title="" id="" values={[""]}/>
          </p>
          <p>
            <button type="submit" className="form-button">
              Gå til
            </button>
          </p>
        </form>
      </>
    );
}

export default Projects;