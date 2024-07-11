
function FloorSummary({floor, chosen, demand, safety}) {
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
                                Dimensjonert
                            </td>
                            <td>
                                {demand && ((demand/1000).toFixed(1)).toLocaleString()} kW
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Prosjektert
                            </td>
                            <td>
                                {chosen && ((chosen / 1000).toFixed(1)).toLocaleString()} kW <span className="table-text-grey"> &nbsp;{safety && safety}% sikk.</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default FloorSummary;