export const title ="Luftmengdetabell";
export const sections = [
    {subTitle: "#", text: "Kolonne 1 er merket med \"#\". Du kan klikke på binders-symbolet for å markere raden ved behov."},
    {subTitle: "Tilluft/avtrekk", text: "Cellene for tilluft og avtrekk kan redigeres. Ved opprettelse av rommet blir luftmengden i disse rommene satt, rundet opp til nærmeste 10-er, etter data angitt i romtypen fra kravspesifikasjonen."},
    {subTitle: null, text: "Tilluft og avtrekk kan redigeres dersom det er ønskelig. Du vil få et varsel under \"Merknad\" dersom luftmengden er under det dimensjonerte kravet, eller det er ubalanset i rommet. Dersom det er rom som skal ha ubalanse, for eksempel WC, kan du bare se bort i fra denne merknaden."},
    {subTitle: "Kolonne \"Rom\"", text:
    <>
        Du kan klikke på romnummeret med <span className="text-accent-color dark:text-dark-accent-color">denne</span> fargen for å få opp en boks som viser samtlige luftmengde-data om rommet, grunnlagsdata, beregnede verdier og rominformasjon.
    </>
    },
    {subTitle: "System", text: "Du vil finne igjen systemene du legger inn under \"Ventilasjonssystemer\" i denne listen her. Luftmengdene som er angitt i \"Tilluft/avtrekk\" blir så lagt til den prosjekterte luftmengden for systemet du velger."},
    {subTitle: "", text: ""},
    {subTitle: "", text: ""},
    {subTitle: "", text: ""},

]