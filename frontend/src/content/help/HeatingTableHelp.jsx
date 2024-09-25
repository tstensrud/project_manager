export const title="Varmetapsberegninger";
export const sections=[
    {subTitle: "#", text: "Kolonne 1 er merket med \"#\". Du kan klikke på binders-symbolet for å markere raden ved behov."},
    {subTitle: "Romnr", text: <>Du kan klikke på romnummeret med <span className="text-accent-color dark:text-dark-accent-color">denne</span> fargen for å få alle grunnlagsdata og beregninger som er gjort for hvert enkelt rom.</>},
    {subTitle: "Redigerbare kolonner", text: "Alle kolonner med arealmål for rommet kan redigeres. Her fører du inn oppmålte verdier fra modell/plantegning. Kun tall trengs å føres inn her. For eksempel \"1\", ikke \"1 m2\"."},
    {subTitle: "Varmetap og valgt varme", text: "Varmetapet summeres opp basert på arealer og romhøyde som føres inn, samt data som ligger under \"Varmedata\". Valgt varme settes automatisk opp til nærmeste 100W. Beregningene er gjort med utgangspunkt 10% sikkerhet.Du kan øke sikkerheten under \"Varmedata\"."},
    {subTitle: "Varmekilde", text:"Du kan sette varmekilde for hvert rom. Dersom alle rom har samme varmekilde, for eksempel \"Radiator\", går du inn på \"Varmedata\" og finner nederst: \"Sett primærvarmekilde for alle rom\"."},
    {subTitle: null, text: "Skriv inn varmekilde og trykk \"Lagre\", og alle rom i bygget vil oppdateres"},
    {subTitle: "Varmedata", text: "Vinduet for varmedata gjelder for det enkelte bygget du har aktivt i tabellene. Verdiene som står i hver felt her er det som allerede ligger i prosjektet. Du kan endre disse ved å redigere verdien, og trykke \"Oppdater\"."},
    {subTitle: null, text: "Dette vil sette denne verdien for ALLE rom i dette bygget. I prosjekter kan bygg ha ulike verdier så disse må settes individuelt hvor hvert bygg. Alle beregninger oppdateres automatisk ved endring av disse verdiene."}
];