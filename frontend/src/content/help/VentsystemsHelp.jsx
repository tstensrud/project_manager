export const title = "Ventilasjonssytemer";
export const sections = [
    { subTitle: "#", text: "Kolonne 1 er merket med \"#\". Du kan klikke på binders-symbolet for å markere raden ved behov." },
    { subTitle: "Legg til nytt system", text: "Fyll inn systemnr, aggregatplassering, betjeningsområde og viftekapasitet. Sett gjenvinner til ønsket, eventuelt sett til \"ingen\" dersom det er et system uten gjenvinner." },
    { subTitle: null, text: "Huk av for spesialsystem dersom det er det. Som for eksempel røykavtrekk, punktavsug eller liknende." },
    { subTitle: "Redigere systemer", text: "Du kan redigere følgende kolonner for hvert system:" },
    {
        subTitle: null, text:
            <ul>
                <li>Systemnr</li>
                <li>Plassering</li>
                <li>Betjeningsområde</li>
                <li>Viftekapasitet</li>
                <li>Gjenvinnertype. (R=roterende, B=batteri, P=plate/kryss)</li>
            </ul>
    },
    { subTitle: null, text: "Kolonnene med prosjektert tilluft blir kontinuerlig beregnet hver gang du knytter et rom opp mot systemet. Dersom den prosjekterte luftmengden overgår viftekapasiteten vil du få et varsel om dette under \"Merknad\"" },
    {
        subTitle: "Slette system", text:
            <>
                Systemene kan slettes. Dette kan <strong>ikke</strong> angres. Alle rom som er tilknyttet dette systemet mister sin systemtilhørighet
                og denne må settes på nytt.
            </>
    },
];