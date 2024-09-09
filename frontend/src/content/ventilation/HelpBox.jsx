function HelpBox() {
    return (
        <>
            <h3>Luftmengdetabell</h3>
            <h4 className="grey-text">Tilluft/avtrekk</h4>
            <p>
                Cellene for tilluft og avtrekk kan redigeres. Ved opprettelse av rommet blir luftmengden i disse rommene satt, rundet opp til nærmeste 10-er, etter data angitt i romtypen fra kravspesifikasjonen.
            </p>
            <p>
                Tilluft og avtrekk kan redigeres dersom det er ønskelig. Du vil få et varsel under "Merknad" dersom luftmengden er under det dimensjonerte kravet, eller det er ubalanset i rommet. Dersom det er rom som skal ha ubalanse,
                for eksempel WC, kan du bare se bort i fra denne merknaden.
            </p>
            <h4 className="grey-text">#</h4>
            <p>
                Kolonne 1 er merket med "#". Du kan klikke på binders-symbolet for å markere raden ved behov.
            </p>
            <h4>Kolonne "Rom"</h4>
            <p>
                Du kan klikke på romnummer for å få opp en boks som viser samtlige luftmengde-data om rommet, grunnlagsdata, beregnede verdier og rominformasjon.
            </p>
            <h4 className="grey-text">System</h4>
            <p>
                Du vil finne igjen systemene du legger inn under "Ventilasjonssystemer" i denne listen her. Luftmengdene som er angitt i "Tilluft/avtrekk" blir så lagt til den prosjekterte luftmengden for systemet du velger.
            </p>
        </>
    );
}

export default HelpBox;