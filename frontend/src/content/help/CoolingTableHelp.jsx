export const title = "Kjølebehov";
export const sections = [
    {subTitle: "#", text: "Kolonne 1 er merket med \"#\". Du kan klikke på binders-symbolet for å markere raden ved behov."},
    {subTitle: "Redigerbare kolonner", text:
    <ul>
        <li>Romtemp <span className="text-grey-text dark:text-dark-grey-text text-sm">(maks temperatur tillatt i rom på sommertid)</span></li>
        <li>Temp vent</li>
        <li>W/pers</li>
        <li>Lys</li>
        <li>Utstyr <span className="text-grey-text dark:text-dark-grey-text text-sm">(hvis rommet har ekstra utstyr som genererer varme)</span></li>
        <li>Soltilskudd</li>
        <li>Solreudksjon <span className="text-grey-text dark:text-dark-grey-text text-sm">(Fra 0 til 1. 1 = 100% solreduksjon.)</span></li>
        <li>Kjøling ustyr</li>
    </ul>},
    {subTitle: "Ekstra vent", text: "Denne kolonnen viser hvor mye ekstra tilluft som må til for å klare kjøling basert på de kjøledataene som er lagt inn."},
    {subTitle: "Kjøledata", text: "Vinduet for kjøledata gjelder for det enkelte bygget du har aktivt i tabellene. Verdiene som står i hver felt her er det som allerede ligger i prosjektet. Du kan endre disse ved å redigere verdien, og trykke \"Oppdater\"."},
    {subTitle: null, text: "Dette vil sette denne verdien for ALLE rom i dette bygget. Du kan redigere disse verdiene for enkeltrom i ettertid dersom det er behov for det. Husk at hvis du gjør individuelle endringer på rom, og oppdaterer en verdi i dette vinduet vil dette overskrive verdien for alle rom i bygget."}
];