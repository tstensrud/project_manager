import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Hooks ++
import { GlobalContext } from '../../context/GlobalContext';
import useSubmitData from '../../hooks/useSubmitData'

// Components
import SubTitleComponent from '../../layout/SubTitleComponent';
import ContentCard from '../../layout/ContentCard.jsx';
import HeaderIcon from '../../assets/svg/newProjectIcon.jsx';
import MainContentContainer from '../../layout/MainContentContainer.jsx';
import CardButton from '../../layout/formelements/CardButton.jsx';
import CardInputField from '../../layout/formelements/CardInputField.jsx';
import TextArea from '../../layout/formelements/TextArea.jsx';
import MessageBox from '../../layout/MessageBox.jsx';

function NewProject() {

    const { setActiveProject, setActiveProjectName } = useContext(GlobalContext);
    const { data, setData, response, loading, error, handleSubmit } = useSubmitData('/projects/new_project/');
    const navigate = useNavigate();

    useEffect(() => {
        setActiveProject(null);
        setActiveProjectName(null);
    }, []);

    useEffect(() => {
        if (response?.success && response.success === true) {
            navigate(`/dashboard`);
        }
    },[response])

    // Handlers
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    }

    const submitProject = async (e) => {
        e.preventDefault();
        await handleSubmit();  
    }
    
    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"Opprett nytt prosjekt"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                <div className="flex justify-center flex-row w-full">
                    <ContentCard width="44">
                        <div>
                        <h2>Opprett nytt prosjekt</h2>
                        <form onSubmit={submitProject}>
                            <div className="mt-3">
                                Prosjektnummer
                            </div>
                            <CardInputField name="projectNumber" placeholder="Prosjektnummer" changeFunction={handleChange} tabIndex={1} required={true} />
                            <div className="mt-3">
                                Prosjektnavn
                            </div>
                            <div>
                                <CardInputField name="projectName" placeholder="Navn på prosjekt" changeFunction={handleChange} tabIndex={2} required={true} />
                            </div>
                            <div className="mt-3">
                                Prosjektbeskrivelse
                            </div>
                            <div>
                                <TextArea name="projectDescription" changeFunction={handleChange} tabIndex={3}  required={true}/>
                            </div>
                            <div className="mt-3">
                                <CardButton loading={loading} buttonText="Legg til" tabIndex={4}/>
                            </div>
                        </form>
                        </div>
                        <div>
                            {
                                response?.success === false && <MessageBox message={response.message} closeable={true} />
                            }
                            {
                                error && <MessageBox message={error} closeable={true} />
                            }
                        </div>
                    </ContentCard>
                </div>
            </MainContentContainer>
        </>
    );
}

export default NewProject;