import Avatar from '../../layout/Avatar.jsx';
import ContentCard from '../../layout/ContentCard.jsx';

function Userinfo({ firebaseData, userData }) {

    return (
        <ContentCard width="32">
            <div className="flex flex-row items-center mb-3 w-full">
                <div>
                    <h2 className="text-grey-text dark:text-dark-grey-text">Din brukerinformasjon</h2>
                </div>
                <div className="flex flex-1 justify-end items-center">
                    <Avatar letter={userData?.name[0]} />
                </div>
            </div>
            <div className="flex flex-col w-full">
                <div className="flex flex-row">
                    <div className="text-grey-text dark:text-dark-grey-text">Brukernavn: </div>
                    <div className="flex flex-1 justify-end">{userData?.name}</div>
                </div>
                <div className="flex flex-row">
                    <div className="text-grey-text dark:text-dark-grey-text">E-mail: </div>
                    <div className="flex flex-1 justify-end">{userData?.email}</div>
                </div>
                <div className="flex flex-row">
                    <div className="text-grey-text dark:text-dark-grey-text">Bruker-ID: </div>
                    <div className="flex flex-1 justify-end">{userData?.uuid}</div>
                </div>
                <div className="flex flex-row">
                    <div className="text-grey-text dark:text-dark-grey-text">Sist innlogget: </div>
                    <div className="flex flex-1 justify-end">
                        {
                            new Date(firebaseData?.last_sign_in_timestamp).toLocaleString('no-NO', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })
                        }
                    </div>
                </div>
                <div className="flex flex-row">
                    <div className="text-grey-text dark:text-dark-grey-text">Opprettet </div>
                    <div className="flex flex-1 justify-end">
                        {
                            new Date(firebaseData?.creation_timestamp).toLocaleString('no-NO', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })
                        }
                    </div>
                </div>
            </div>
        </ContentCard>
    );
}

export default Userinfo;