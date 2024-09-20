import SubTitleComponent from './SubTitleComponent';
import MainContentContainer from './MainContentContainer.jsx';
import HeaderIcon from '../assets/svg/notFoundIcon.jsx';

function NotFound() {
    return (
        <>
            <SubTitleComponent svg={<HeaderIcon />} headerText={"404"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                <div className="flex w-full h-full text-dark-primary-color justify-center text-center items-center bg-gradient-to-tr from-dark-tertiary-color to-dark-secondary-color">
                    <div className="flex flex-col overflow-auto justify-center items-center text-center bg-dark-secondary-color border border-dark-accent-color rounded-lg shadow-lg shadow-background-shade h-[40%]">
                        <div className="flex flex-col items-center justify-center pl-20 pr-20 h-full text-2xl">
                            <div>
                                404
                            </div>
                            <div>
                                Denne siden finnes ikke
                            </div>
                        </div>
                    </div>
                </div >
            </MainContentContainer>
        </>
    );
}

export default NotFound