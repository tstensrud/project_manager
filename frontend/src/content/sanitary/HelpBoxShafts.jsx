function HelpBox() {
    return (
        <>
            <h3>Sanitærsjakter</h3>
            <h4 className="text-grey-text dark:text-dark-grey-text">Merking av rader</h4>
            <p>
                Du kan klikke hvor som helst på en rad for å markere denne ved behov.
            </p>
            <h4 className="text-grey-text dark:text-dark-grey-text">Sjakter</h4>
            <p>
                Sjaktene hentes fra sjaktnummer/merking satt under "Sanitærutstyr". Rørdimensjoner for tappevann (Cu) og spillvann (Støpejernsrør) beregnes ut i fra antall ustyr som er satt inn, samt avløpskurve som er satt 
                på siden "Sanitæranlegg".
            </p>
            <p>
                Rørdimensjonene er dimensjonert for hver sjakt og justert for vannmengden i hver etasje etter hver som man beveger seg nedover bygget.
            </p>
        </>
    );
}

export default HelpBox;