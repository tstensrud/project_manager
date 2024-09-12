import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../GlobalContext';

import useFetch from '../../hooks/useFetch'
import SubTitleComponent from '../../layout/SubTitleComponent';
import AccountIcon from '../../assets/svg/accountIcon.jsx'
import MainContentContainer from '../../layout/MainContentContainer.jsx';

function UserProfile() {
    const { userUuid, } = useContext(GlobalContext);
    const { data, refetch } = useFetch(`/user/${userUuid}/`);

    return (
        <>
            <SubTitleComponent svg={<AccountIcon />} headerText={"Brukerkonto"} projectName={""} projectNumber={""} />
            <MainContentContainer>
                <div className="flex justify-center flex-row w-full">

                    <div className="cards">
                        <div className="information [ card ]">
                            <h2>Brukerinfo</h2>
                            {data && data.error ? <><h3>{data.error}</h3></> : ''}
                            {data && data.user ?
                                <>
                                    <p className="info">Brukernavn: {data.user.name}</p>
                                    <br />
                                    <p className="info">Email: {data.user.email}</p>
                                    <br />
                                    <p className="info">Bruker-ID: {data.user.uuid}</p>
                                </> : ''}
                        </div>
                    </div>
                </div>
            </MainContentContainer>
        </>
    );
}

export default UserProfile;