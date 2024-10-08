import React, { useContext, useState } from 'react';

// components
import ContentCard from '../../../layout/ContentCard.jsx';
import MessageNavButtons from './MessageNavButtons.jsx';
import Inbox from './Inbox.jsx';
import Sent from './Sent.jsx';
import Archive from './Archive.jsx';
import NewMessage from './NewMessage.jsx';


function Messages() {
    const [activeIndex, setActiveIndex] = useState(0);
    const navItems = [
        { buttonText: "Innboks", component: <Inbox /> },
        { buttonText: "Ny melding", component: <NewMessage /> },
        { buttonText: "Sendt", component: <Sent /> },
        { buttonText: "Arkiv", component: <Archive /> }
    ];

    return (
        <ContentCard>
            <div className="flex flex-row mb-3 w-full">
                <div>
                    <h2 className="text-grey-text dark:text-dark-grey-text">Meldinger</h2>
                </div>
                <div className="flex flex-1 justify-end items-center">
                    <div className="w-fit dark:bg-dark-accent-color bg-accent-color p-1 border border-accent-color dark:border-dark-accent-color rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="stroke-secondary-color stroke-2 dark:stroke-dark-primary-color fill-none">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="flex flex-row w-full mb-5">
                    {
                        navItems.map((item, index) => (
                            <div key={`navbutton-${index}`} className="mr-2">
                                <MessageNavButtons index={index} activeIndex={activeIndex} setActiveIndex={setActiveIndex} buttonText={item.buttonText} />
                            </div>
                        ))
                    }
                </div>
            </div>

            <div>
                {
                    navItems.map((item, index) => (
                        index === activeIndex &&
                        <React.Fragment key={index}>
                            {item.component}
                        </React.Fragment>
                    ))
                }
            </div>

        </ContentCard>
    );


}

export default Messages;