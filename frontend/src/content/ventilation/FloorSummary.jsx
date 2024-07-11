
function FloorSummary({floor, supply, extract}) {
    return (
        <>
            <div className="table-wrapper-tiny">
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
                             <span className="supply-text">{supply && supply}</span>  m<sup>3</sup>/h
                            </td>
                        </tr>
                        <tr>
                        <td>
                           Avtrekk
                            </td>
                            <td>
                            <span className="extract-text">{extract && extract}</span>  m<sup>3</sup>/h
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default FloorSummary;