function HelpBox() {
    return (
        <>
            <h3>Tabell for sanitærutstyr</h3>
            <h4>#</h4>
            <p>
                Kolonne 1 er merket med "#". Du kan klikke på dette symbolet for å markere raden ved behov.
            </p>
            <h4>Sjakt</h4>
            <p>
                Hvis du ønsker å nummerere sjaktene i prosjektet kan du legge inn her hvilke sjakt hvert rom
                kobles til. Under "Sanitærsjakter" fra prosjektmenyen
                får du da hver sjakt oppsummert for hvert bygg, med rørdimensjoner beregnet automatisk,
                justert for vannmengde i hver etasje, både for spillvann ogt tappevann.
            </p>
            <p>
                For eksempel kan du merke sjakt med "1", "A" eller et annet kjennetegn du velger fritt.
            </p>
            <h4>Sanitærutstyr</h4>
            <p>
                Alle felter under et sanitærustyr kan redigeres. Fyll inn antall utstyr for hvert rom.
                Alle vannmengdeberegninger blir deretter gjort automatisk og antall ustyr vises oppsummert i
                bunn av tabellen, samt på samlesiden "Sanitærutstyr".
            </p>
            <p>
                Disse cellene skal kun inneholde tall. Sett inn "1" og ikke "1 stk", for eksempel.
            </p>
        </>
    );
}

export default HelpBox;