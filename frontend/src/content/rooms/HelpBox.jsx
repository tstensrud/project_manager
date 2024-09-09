function HelpBox() {
    return (
        <>
            <h3>Romliste</h3>
            <h4 className="grey-text">Legg til nytt rom</h4>
            <p>
                Øverst på siden kan du legge til nytt rom. Velg bygg, etasje og romnr. Romtypene hentes fra romtyper lagt inn
                i kravspesifikasjonen til prosjektet. Fyll deretter inn navn på rom, areal og personbelastning. Personer settes
                til 0 dersom det ikke har noen belastning.
            </p>
            <p>
                Når alt er fylt ut klikk "Legg til" og rommet dukker opp i tabellene under. Rommet vil da være tilgjengelig i
                alle de andre VVS-beregningene som gjøres
            </p>
            <h4 className="grey-text">#</h4>
            <p>
                Kolonne 1 er merket med "#". Du kan klikke på binders-symbolet for å markere raden ved behov.
            </p>
            <h4 className="grey-text">Redigere rom</h4>
            <p>
                Du kan redigere følgende kolonner  for hvert rom:
            </p>
            <ul>
                <li>
                    Etasje
                </li>
                <li>
                    Romnr
                </li>
                <li>
                    Romnavn
                </li>
                <li>
                    Areal
                </li>
                <li>
                    Personantall
                </li>
                <li>
                    Kommentar
                </li>
            </ul>

            <p>
                Romtype kan ikke endres. Hvis det er nødvendig å endre romtype må du slette rommet og legge det inn på nytt
            </p>
            <h4 className="grey-text">Slette rom</h4>
            <p>
                I siste kolonne har du en "Slett"-knapp. Trykker du på denne får du muligheten til å angre dersom du trykker
                ved en feil. Merk at denne angremuligheten forsvinner så fort du går ut av tabellen ved å for eksempel bytte
                bygg eller gå til et annet sted av siden.
            </p>
        </>
    );
}

export default HelpBox;