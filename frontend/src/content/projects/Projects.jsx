import { useState, useEffect } from 'react'
import SubTitleComponent from '../../layout/SubTitleComponent';
import axios from 'axios';
import SelectComponent from '../../formcomponents/SelectComponent';
import useFetch from '../../hooks/useFetch'

function Projects() {
  
    const {data, loading, error} = useFetch('projects/');
    if (loading) return <>Loading</>;
    if (error) return <>Error: {error.message}</>;

    return (
      <>
        <SubTitleComponent>
          Prosjekter
        </SubTitleComponent>

        {data.data}

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