import { GlobalContext } from '../../GlobalContext';
import useFetch from '../../hooks/useFetch'
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import SubTitleComponent from '../../layout/SubTitleComponent';
import BuildingSummary from './BuildingSummary';
import useSubmitData from '../../hooks/useSubmitData'

function Buildings() {
    const {projectId} = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);
    const [allData, setAllData] = useState();
    const [formInput, setFormInput] = useState('');
    const {data, loading, error, refetch} = useFetch(`/buildings/${projectId}/`);
    const {buildingData, setData, handleSubmit} = useSubmitData(`/buildings/${projectId}/new_building/`);
    
    useEffect(() => {
        setActiveProject(projectId);
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
            Bygg tilknyttet 
        </SubTitleComponent>
        <div className="text-container">
            <div className="summaries-wrapper">
                <h1 className="app-content-Text">Legg til bygg i prosjekt</h1>
                <form className="custom-form profile-form" onSubmit={handleFormSubmit}>
                    <p>
                        <input
                        onChange={handleChange}
                        type="text"
                        value={formInput}
                        name="buildingName"
                        placeholder="Navn på bygg" />
                        <button type="submit" className="form-button">
                            Legg til
                        </button>

                    </p>
                </form>
            </div>
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

    </>);
}

export default Buildings;