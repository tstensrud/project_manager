function HelpBox() {
    return (
        <>
            <h3>Varmetapsberegninger</h3>
            <h4 className="text-grey-text dark:text-dark-grey-text">#</h4>
            <p>
                Kolonne 1 er merket med "#". Du kan klikke på binders-symbolet for å markere raden ved behov.
            </p>
            <h4 className="text-grey-text dark:text-dark-grey-text">Romnr</h4>
            <p>
                Du kan klikke på romnummeret med <span className="text-accent-color dark:text-dark-accent-color">denne</span> fargen for å få alle grunnlagsdata og beregninger som er gjort for hvert enkelt rom.
            </p>
            <h4 className="text-grey-text dark:text-dark-grey-text">Redigerbare kolonner</h4>
            <p>
                Alle kolonner med arealmål for rommet kan redigeres. Her fører du inn oppmålte verdier fra modell/plantegning. Kun tall trengs å føres inn her. For eksempel "1", ikke "1 m2".
            </p>
            <h4 className="text-grey-text dark:text-dark-grey-text">Varmetap og valgt varme</h4>
            <p>
                Varmetapet summeres opp basert på arealer og romhøyde som føres inn, samt data som ligger under "Varmedata". Valgt varme settes automatisk opp til nærmeste 100W. Beregningene er gjort med utgangspunkt 10% sikkerhet.
                Du kan øke sikkerheten under "Varmedata".
            </p>
            <h4 className="text-grey-text dark:text-dark-grey-text">Varmekilde</h4>
            <p>
                Du kan sette varmekilde for hvert rom. Dersom alle rom har samme varmekilde, for eksempel "Radiator", går du inn på "Varmedata" og finner nederst: "Sett primærvarmekilde for alle rom".
            </p>
            <p>
                Skriv inn varmekilde og trykk "Lagre", og alle rom i bygget vil oppdateres
            </p>

            <h3>Varmedata</h3>
            <p>
                Vinduet for varmedata gjelder for det enkelte bygget du har aktivt i tabellene. Verdiene som står i hver felt her er det som allerede ligger i prosjektet. Du kan endre disse ved å redigere verdien, og trykke "Oppdater".
            </p>
            <p>
                Dette vil sette denne verdien for ALLE rom i dette bygget. I prosjekter kan bygg ha ulike verdier så disse må settes individuelt hvor hvert bygg. Alle beregninger oppdateres automatisk ved endring av disse verdiene.
            </p>
        </>
    );
}

export default HelpBox;