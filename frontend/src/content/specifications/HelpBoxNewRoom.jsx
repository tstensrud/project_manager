function HelpBoxNewRoom() {
    return (
        <>
            <h3>Nytt rom</h3>
            <h4>Romtype</h4>
            <p>
                Fyll inn romtype. Et generelt navn, som for eksempel "Kontor" eller "Klasserom". Disse romtypene finner du igjen når du skal legge inn rom i prosjektet
            </p>

            <h4>Luftmengder</h4>
            <p>
                Fyll inn luftmengdekravene som skal gjelde for kravspesifikasjonen. Bruk bare tall. Det er ikke nødvendig å angi "m3/h" eller liknende.
            </p>
            <h4>Ventilasjonsprinsipp</h4>
            <p>
                Velg hvilket ventilasjonsprinsipp som er krav for dette rommet. Normalt er dette omrøring, men det kan være krav til fortrengning eller noe annet.
            </p>
            <h4>Gjenvinner</h4>
            <p>
                <ul>
                    <li>R = Roterende</li>
                    <li>B = Varmebatteri</li>
                    <li>P = Plate/kryss</li>
                </ul>
            </p>
            
            <h4>Lyd</h4>
            <p>
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
            </p>

            <h4>Styring</h4>
            <p>
                <ul>
                    <li>VAV = Variable luftmengde</li>
                    <li>CAV = Konstant luftmengde</li>
                    <li>T = Temperatur</li>
                    <li>B = Bevegelse</li>
                    <li>CO2 - Styres på CO2-mengder</li>
                    <li>F = Fukt</li>
                </ul>
            </p>
            <h4>Presiseringer</h4>
            <p>
                Her kan du notere ned spesifike ting for romtypen som er angitt av BH.
            </p>
        </>
    );
}

export default HelpBoxNewRoom;