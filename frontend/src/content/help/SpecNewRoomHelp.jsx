export const title = "Nytt rom";
export const sections = [
    { subTitle: "Romtype", text: "Fyll inn romtype. Et generelt navn, som for eksempel \"Kontor\" eller \"Klasserom\". Disse romtypene finner du igjen når du skal legge inn rom i prosjektet" },
    { subTitle: "Luftmengder", text: "Fyll inn luftmengdekravene som skal gjelde for kravspesifikasjonen. Bruk bare tall. Det er ikke nødvendig å angi \"m3/h\" eller liknende." },
    { subTitle: "Ventilasjonsprinsipp", text: "Velg hvilket ventilasjonsprinsipp som er krav for dette rommet. Normalt er dette omrøring, men det kan være krav til fortrengning eller noe annet." },
    {
        subTitle: "Gjenvinner", text:
            <ul>
                <li>R = Roterende</li>
                <li>B = Varmebatteri</li>
                <li>P = Plate/kryss</li>
            </ul>
    },
    {
        subTitle: "Lyd", text:
            <ul>
                <li>db-Teknisk - maks lydnivå fra det tekniske anlegget</li>
                <li>db-naborom - maks lydnivå overført til naborom</li>
                <li>db-korridor - maks lydnivå overført til korridorsone</li>
            </ul>

    },
    { subTitle: "Styring", text:
        <ul>
        <li>VAV = Variable luftmengde</li>
        <li>CAV = Konstant luftmengde</li>
        <li>T = Temperatur</li>
        <li>B = Bevegelse</li>
        <li>CO2 - Styres på CO2-mengder</li>
        <li>F = Fukt</li>
    </ul>
    },
    { subTitle: "Presiseringer", text: "Her kan du notere ned spesifike ting for romtypen som er angitt av byggherre." },
];