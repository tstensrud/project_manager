function HelpBox() {
    return (
        <>
            <h3>Ventilasjonssytemer</h3>
            <h4 className="text-grey-text dark:text-dark-grey-text">Legg til nytt system</h4>
            <p>
                Fyll inn systemnr, aggregatplassering, betjeningsområde og viftekapasitet. Sett gjenvinner til ønsket, eventuelt 
                sett til "ingen" dersom det er et system uten gjenvinner.
            </p>
            <p>
                Huk av for spesialsystem dersom det er det. Som for eksempel røykavtrekk, punktavsug eller liknende.
            </p>
            <h4 className="text-grey-text dark:text-dark-grey-text">#</h4>
            <p>
                Kolonne 1 er merket med "#". Du kan klikke på binders-symbolet for å markere raden ved behov.
            </p>
            <h4 className="text-grey-text dark:text-dark-grey-text">Redigere systemer</h4>
            <p>
                Du kan redigere følgende kolonner for hvert system:
            </p>
                <ul>
                    <li>
                        Systemnr
                    </li>
                    <li>
                        Plassering
                    </li>
                    <li>
                        Betjeningsområde
                    </li>
                    <li>
                        Viftekapasitet
                    </li>
                    <li>
                        Gjenvinnertype. (R=roterende, B=batteri, P=plate/kryss)
                    </li>
                </ul>

            <p>
                Kolonnene med prosjektert tilluft blir kontinuerlig beregnet hver gang du knytter et rom opp mot systemet. Dersom
                den prosjekterte luftmengden overgår viftekapasiteten vil du få et varsel om dette under "Merknad".
            </p>
            <h4 className="text-grey-text dark:text-dark-grey-text">Slette system</h4>
            <p>
                Systemene kan slettes. Dette kan <strong>ikke</strong> angres. Alle rom som er tilknyttet dette systemet mister sin systemtilhørighet
                og denne må settes på nytt.
            </p>
        </>
    );
}

export default HelpBox;