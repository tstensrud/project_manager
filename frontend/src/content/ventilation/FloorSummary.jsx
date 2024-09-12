
function FloorSummary({floor, supply, extract}) {
    return (
        <>
            <div className="flex flex-col ml-5 mr-5 mt-0 h-auto rounded-bl-lg rounded-br-lg bg-secondary-color shadow-lg shadow-background-shade mb-5-tiny">
                <table className="fl-table-summary">
                    <thead>
                        <th>
                        Plan {floor && floor}
                        </th>
                        <th>
                            Totalt
                        </th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                             Tilluft
                            </td>
                            <td>
                             <span className="text-supply-color">{supply && supply}</span>  m<sup>3</sup>/h
                            </td>
                        </tr>
                        <tr>
                        <td>
                           Avtrekk
                            </td>
                            <td>
                            <span className="text-extract-color">{extract && extract}</span>  m<sup>3</sup>/h
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default FloorSummary;