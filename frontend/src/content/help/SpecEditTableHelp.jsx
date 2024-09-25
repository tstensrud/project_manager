export const title = "Redigere romtyper for kravspesifikasjon";
export const sections = [
    {subTitle: "Kolonner", text: "Alle kolonner kan endres. Luftmengdeverdier må kun inneholde tall. En endring i disse vil reflekteres i alle luftmengdeberegninger i alle prosjekter som har hentet data fra denne kravspesifikasjonen. Vær derfor svært forsiktig før du setter nye luftmengdekrav. Hvis en kravspesifikasjon er oppdatert, lag heller en ny med nye luftmengder slik at gamle prosjekter ikke ender opp med nye luftmengder."},
    {subTitle: "Gjenvinner", text:
    <ul>
        <li>R = Roterende</li>
        <li>B = Varmebatteri</li>
        <li>P = Plate/kryss</li>
    </ul>},
    {subTitle: "Styring", text:
        <ul>
        <li>VAV = Variable luftmengde</li>
        <li>CAV = Konstant luftmengde</li>
        <li>T = Temperatur</li>
        <li>B = Bevegelse</li>
        <li>CO2 - Styres på CO2-mengder</li>
        <li>F = Fukt</li>
    </ul>
    },
    {subTitle: "Presiseringer", text: "Her kan du notere ned spesifike ting for romtypen som er verdt å vite når man prosjekterer."},
    {subTitle: "Lyd", text:
        <ul>
        <li>db-Teknisk - maks lydnivå fra det tekniske anlegget</li>
        <li>db-naborom - maks lydnivå overført til naborom</li>
        <li>db-korridor - maks lydnivå overført til korridorsone</li>
    </ul>
    },
    {subTitle: "Kommentar", text: "Fyll inn kommentar som er til for internt bruk."},
    {subTitle: "Slett rom", text: "Sletting av rom kan ikke angres. Alle rom som allerede har hentet data fra denne romtypen beholder sine data, men hvis du trenger å hente dataene fra romtypen på nytt må det legges inn igjen i kravspesifikasjonen."},
    {subTitle: "Sletting av kravspesifikasjon", text: "Dette valget kan ikke reverseres. Alle rom blir borte, men eksisterende rom i prosjekter beholder sine romdata, likt som om du sletter enkeltrom."},
];