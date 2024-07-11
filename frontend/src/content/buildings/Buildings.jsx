import { GlobalContext } from '../../GlobalContext';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import useFetch from '../../hooks/useFetch'
import SubTitleComponent from '../../layout/SubTitleComponent';
import BuildingSummary from './BuildingSummary';
import useSubmitData from '../../hooks/useSubmitData'
import HeaderIcon from '../../assets/svg/buildingIcon.svg?react';

function Buildings() {
    const {projectId} = useParams();
    const { activeProject, setActiveProject, token, setToken } = useContext(GlobalContext);

    // Hooks
    const {data, loading, error, refetch} = useFetch(`/project_api/${projectId}/buildings/`);
    const {buildingData, setData, handleSubmit} = useSubmitData(`/project_api/${projectId}/buildings/new_building/`);
    const [allData, setAllData] = useState();
    const [formInput, setFormInput] = useState('');

    // Handlers
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

            <div className="container-above-table-rooms-top">
                <form className="custom-form profile-form" onSubmit={handleFormSubmit}>

                    <input onChange={handleChange} type="text" value={formInput} name="buildingName" placeholder="Navn på bygg. Eks.: A, Hovedbygg" />
                    &nbsp;&nbsp;
                    <button type="submit" className="form-button">Legg til </button>

                </form>
            </div>

            <div className="flex-container-row">
                {
                    data && data.building_data === null ? (
                        <p className="p-description">{data.error}</p>
                    ) : (
                        data && data.building_data && Object.keys(data.building_data).map((key, index) => (
                            <BuildingSummary key={index} buildingData={data.building_data[key]} />
                        ))
                    )
                }

            </div>
        </div>
    </>
    );
}

export default Buildings;