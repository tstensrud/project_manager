import { GlobalContext } from '../../GlobalContext';
import useFetch from '../../hooks/useFetch'
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import SubTitleComponent from '../../layout/SubTitleComponent';
import BuildingSummary from './BuildingSummary';
import useSubmitData from '../../hooks/useSubmitData'
import HeaderIcon from '../../assets/svg/buildingIcon.svg?react';

function Buildings() {
    const {projectId} = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    const [allData, setAllData] = useState();
    const [formInput, setFormInput] = useState('');
    const {data, loading, error, refetch} = useFetch(`/project_api/${projectId}/buildings/`);
    const {buildingData, setData, handleSubmit} = useSubmitData(`/project_api/${projectId}/buildings/new_building/`);
    
    useEffect(() => {
        setActiveProject(projectId);
        if (data) {
            console.log(data.building_data);
        }
    },[]);


    const handleChange = (e) => {
        setData({
            ...buildingData,
            [e.target.name]: e.target.value,
        })
        setFormInput(e.target.value);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await handleSubmit(e);
        refetch();
        setFormInput('');
    }

    return(<>
        <SubTitleComponent>
          <HeaderIcon />  Bygg
        </SubTitleComponent>
        <div className="main-content">
            <div className="text-container-above-tables">
            <p>
            Legg til bygg i prosjekt
            </p>
            <form className="custom-form profile-form" onSubmit={handleFormSubmit}>
                <p>
                    <input onChange={handleChange} type="text" value={formInput} name="buildingName" placeholder="Navn på bygg" />
                    &nbsp;&nbsp;
                    <button type="submit" className="form-button">Legg til </button>

                </p>
            </form>
            </div>
            <div className="flex-container-row">
                {
                    data && data.building_data === null ? (
                        <p className="p-description">Ingen bygg lagt inn</p>
                    ) : (
                        data && Object.keys(data.building_data).map((key, index) => (
                            <BuildingSummary key={index} buildingData={data.building_data[key]} />
                        ))
                    )
                }
                
            </div>
            </div>
    </>);
}

export default Buildings;