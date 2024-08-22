function HelpBoxEdit() {
    return (
        <>
            <h3>Redigere romtyper for kravspesifikasjon</h3>
            <h4>Kolonner</h4>
            <p>
                Alle kolonner kan endres. Luftmengdeverdier må kun inneholde tall. En endring i disse vil reflekteres i alle luftmengdeberegninger i alle prosjekter som har hentet data fra denne kravspesifikasjonen. Vær derfor
                svært forsiktig før du setter nye luftmengdekrav. Hvis en kravspesifikasjon er oppdatert, lag heller en ny med nye luftmengder slik at gamle prosjekter ikke ender opp med nye luftmengder.
            </p>

            <h4>Gjenvinner</h4>
            
                <ul>
                    <li>R = Roterende</li>
                    <li>B = Varmebatteri</li>
                    <li>P = Plate/kryss</li>
                </ul>
            

            <h4>Styring</h4>
            
                <ul>
                    <li>VAV = Variable luftmengde</li>
                    <li>CAV = Konstant luftmengde</li>
                    <li>T = Temperatur</li>
                    <li>B = Bevegelse</li>
                    <li>CO2 - Styres på CO2-mengder</li>
                    <li>F = Fukt</li>
                </ul>
            
            <h4>Presiseringer</h4>
            <p>
                Her kan du notere ned spesifike ting for romtypen som er verdt å vite når man prosjekterer.
            </p>

            <h4>Lyd</h4>
            
                <ul>
                    <li>
                        db-Teknisk - maks lydnivå fra det tekniske anlegget
                    </li>
                    <li>
                        db-naborom - maks lydnivå overført til naborom
                    </li>
                    <li>
                        db-korridor - maks lydnivå overført til korridorsone
                    </li>
                </ul>
            

            <h4>Kommentar</h4>
            <p>
                Fyll inn kommentar som er til for internt bruk.
            </p>

            <h4>Slett rom</h4>
            <p>
                Sletting av rom kan ikke angres. Alle rom som allerede har hentet data fra denne romtypen beholder sine data, men hvis du trenger å hente dataene fra romtypen på nytt må det legges inn igjen i kravspesifikasjonen.
            </p>
            <h4>Sletting av kravspesifikasjon</h4>
            <p>
                Dette valget kan ikke reverseres. Alle rom blir borte, men eksisterende rom i prosjekter beholder sine romdata, likt som om du sletter enkeltrom.
            </p>
        </>
    );
}

export default HelpBoxEdit;