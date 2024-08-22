function HelpBox() {
    return (
        <>
            <h3>Kjølebehov</h3>
            <h4>#</h4>
            <p>
                Kolonne 1 er merket med "#". Du kan klikke på dette symbolet for å markere raden ved behov.
            </p>
            <h4>Redigerbare kolonner</h4>
            <p>
                Følgende kolonner er redigerbare:
            </p>
            <ul>
                <li>Romtemp <span className="grey-info-text">(maks temperatur tillatt i rom på sommertid)</span></li>
                <li>Temp vent</li>
                <li>W/pers</li>
                <li>Lys</li>
                <li>Utstyr <span className="grey-info-text">(hvis rommet har ekstra utstyr som genererer varme)</span></li>
                <li>Soltilskudd</li>
                <li>Solreudksjon <span className="grey-info-text">(Fra 0 til 1. 1 = 100% solreduksjon.)</span></li>
                <li>Kjøling ustyr</li>
            </ul>

            <h4>Ekstra vent</h4>
            <p>
                Denne kolonnen viser hvor mye ekstra tilluft som må til for å klare kjøling basert på de kjøledataene som er lagt inn.
            </p>

            <h3>Kjøledata</h3>
            <p>
                Vinduet for kjøledata gjelder for det enkelte bygget du har aktivt i tabellene. Verdiene som står i hver felt her er det som allerede ligger i prosjektet. Du kan endre disse ved å redigere verdien, og trykke "Oppdater".
            </p>
            <p>
                Dette vil sette denne verdien for ALLE rom i dette bygget. Du kan redigere disse verdiene for enkeltrom i ettertid dersom det er behov for det. Husk at hvis du gjør individuelle endringer på rom, og oppdaterer en verdi i dette vinduet
                vil dette overskrive verdien for alle rom i bygget.
            </p>
        </>
    );
}

export default HelpBox;