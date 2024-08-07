import React from 'react';
import FloorSummary from './FloorSummary';

function BuildingSummary({data}) {
    const summaries = data && data.floor_summaries
    //console.log(summaries)
    return(
        <>
            {
                summaries && Object.keys(summaries).map((key, index) => (
                    <><FloorSummary key={index} floor={key} supply={summaries[key].supply} extract={summaries[key].extract} />&nbsp;</>
                ))
            }
        </>
    );
}

export default BuildingSummary;