import React from 'react';
import FloorSummary from './FloorSummary';

function BuildingSummary({data}) {
    const summaries = data?.floor_summaries_heating;
    const safety = data?.Safety;
    return(
        <>
            {
                summaries && Object.keys(summaries).map((key, index) => (
                    <FloorSummary key={index} floor={key} demand={summaries[key].demand} chosen={summaries[key].chosen} safety={safety} />
                ))
            }
        </>
    );
}

export default BuildingSummary;