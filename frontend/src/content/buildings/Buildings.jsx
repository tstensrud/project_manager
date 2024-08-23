import { useParams } from 'react-router-dom';
import { useState } from 'react';

import useFetch from '../../hooks/useFetch'
import SubTitleComponent from '../../layout/SubTitleComponent';
import BuildingSummary from './BuildingSummary';
import useSubmitData from '../../hooks/useSubmitData'
import HeaderIcon from '../../assets/svg/buildingIcon.svg?react';
import LoadingSpinner from '../../layout/LoadingSpinner';

function Buildings() {
    const { projectId } = useParams();

    // Hooks
    const { data, loading, refetch: refetchBuildingData } = useFetch(`/project_api/${projectId}/buildings/`);
    const { buildingData, setData, handleSubmit } = useSubmitData(`/project_api/${projectId}/buildings/new_building/`);
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
        refetchBuildingData();
        setFormInput('');
    }

    return (<>
        <SubTitleComponent svg={<HeaderIcon />} headerText={"Bygg"} projectName={""} projectNumber={""} />
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
                    loading && loading === true ? (
                        <>
                            <span className="loading-text">####</span>
                            <br />
                            <LoadingSpinner />
                        </>
                    ) : (
                        <>
                            {
                                data && data.building_data === null ? (
                                    <p className="p-description">{data.error}</p>
                                ) : (
                                    data && data.building_data && Object.keys(data.building_data).map((key, index) => (
                                        <BuildingSummary refetchBuildingData={refetchBuildingData} key={index} buildingData={data.building_data[key]} />
                                    ))
                                )
                            }
                        </>
                    )
                }


            </div>
        </div>
    </>
    );
}

export default Buildings;