import { Link, useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

// Hooks
import useFetchExcel from '../../hooks/useFetchExcel'

// Components
import SubTitleComponent from '../../layout/SubTitleComponent';
import HeaderIcon from '../../assets/svg/reportsIcon.svg?react';


function Reports() {
    const { projectId } = useParams();
    const { response: ventResponse, loading: ventLoading, error: ventError, handleSubmit: submitVentilation } = useFetchExcel(`/project_api/${projectId}/excel/ventilation/`);
    const { response: heatingResponse, loading: heatingLoading, error: heatingError, handleSubmit: submitHeating } = useFetchExcel(`/project_api/${projectId}/excel/heating/`);
    //console.log(response)

    const handleGetVentSheet = (e) => {
        e.preventDefault(e);
        submitVentilation(e);
    }

    const handleGetVentComplete = (e) => {
        e.preventDefault();
        
    }

    const handleGetHeatingSheet = (e) => {
        e.preventDefault(e);
        submitHeating(e);
    }



    return (
        <>
            <div className="main-content">
                <SubTitleComponent svg={<HeaderIcon />} headerText={"Rapporter"} projectName="" projectNumber="" />
                <div className="flex-container-row">
                    <div className="cards">
                        <div className="information [ card ]">
                            <p className="info">Excel-utskrifter</p>
                            <p>
                                Ventilasjon
                            </p>
                            <ul>
                                <li>
                                    <Link to="#" onClick={handleGetVentSheet}>Oppsummert</Link>
                                </li>
                                <li>
                                    <Link to="#" onClick={handleGetVentSheet}>Komplett</Link>
                                </li>
                            </ul>
                            <p>
                                Varmetapsberegninger
                            </p>
                            <ul>
                                <li>
                                    <Link to="#" onClick={handleGetHeatingSheet}>Oppsummert</Link>
                                </li>
                                <li>
                                    <Link to="#" onClick={handleGetHeatingSheet}>Komplett</Link>
                                </li>
                            </ul>
                            <p>
                                Kjøling
                            </p>
                            <ul>
                                <li>
                                    Oppsummert
                                </li>
                                <li>
                                    Komplett
                                </li>
                            </ul>
                            <p>
                                Samlet rapport vent, varme og kjøl
                            </p>
                            <ul>
                                <li>
                                    Last ned
                                </li>
                            </ul>
                            <p>
                                Sanitæranlegg
                            </p>
                            <ul>
                                <li>
                                    Sanitærutstyr
                                </li>
                                <li>
                                    Oppsummering
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Reports;