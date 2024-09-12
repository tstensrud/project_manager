
function FloorSummary({floor, chosen, demand, safety}) {
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
                                {chosen && ((chosen / 1000).toFixed(1)).toLocaleString()} kW <span className="text-grey-text"> &nbsp;{safety && safety}% sikk.</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
export default FloorSummary;