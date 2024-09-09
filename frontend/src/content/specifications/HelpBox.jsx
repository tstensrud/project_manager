function HelpBox() {
    return (
        <>
            <h3>Kravspesifikasjon</h3>
            <h4 className="grey-text">Tabell</h4>
            <p>
                Viser en oversikt over alle romtypene som er lagt inn i denne kravspsifikasjonen
            </p>
            <h4 className="grey-text">Nye romtyper</h4>
            <p>
                Ønsker du å legge til nye romtyper velger du enen å laste opp CSV-fil (midlertidig avskrudd) eller velger å legge inn enkeltrom.
            </p>
            <h4 className="grey-text">Redigere romtyper</h4>
            <p>
                Romtypene kan redigeres ved å klikke på "Rediger kravspesifikasjon". Her kan du også endre navn på spesifikasjonen samt slette den dersom den ikke skal benyttes.
            </p>
        </>
    );
}

export default HelpBox;