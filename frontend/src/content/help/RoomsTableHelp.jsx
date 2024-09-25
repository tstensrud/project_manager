export const title = "Romliste";
export const sections = [
    { subTitle: "Legg til nytt rom", text: "Øverst på siden kan du legge til nytt rom. Velg bygg, etasje og romnr. Romtypene hentes fra romtyper lagt inn i kravspesifikasjonen til prosjektet. Fyll deretter inn navn på rom, areal og personbelastning. Personer settes til 0 dersom det ikke har noen belastning." },
    { subTitle: null, text: "Når alt er fylt ut klikk \"Legg til\" og rommet dukker opp i tabellene under. Rommet vil da være tilgjengelig i alle de andre VVS-beregningene som gjøres" },
    { subTitle: "#", text: "Kolonne 1 er merket med \"#\". Du kan klikke på binders-symbolet for å markere raden ved behov." },
    { subTitle: "Redigere rom", text: "Du kan redigere følgende kolonner  for hvert rom" },
    {
        subTitle: null, text:
            <ul>
                <li>Etasje</li>
                <li>Romnr</li>
                <li>Romnavn</li>
                <li>Areal</li>
                <li>Personantall</li>
                <li>Kommentar</li>
            </ul>
    },
    { subTitle: null, text: "Romtype kan ikke endres. Hvis det er nødvendig å endre romtype må du slette rommet og legge det inn på nytt." },
    { subTitle: "Slette rom", text: "I siste kolonne har du en \"Slett\"-knapp. Trykker du på denne får du muligheten til å angre dersom du trykkerved en feil. Merk at denne angr emuligheten forsvinner så fort du går ut av tabellen ved å for eksempel bytte bygg eller gå til et annet sted av siden." }
];