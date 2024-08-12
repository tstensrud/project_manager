import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

import useFetch from '../../hooks/useFetch.jsx'

import TapwaterIcon from '../../assets/svg/tapWaterIcon.svg?react';
import SubTitleComponent from '../../layout/SubTitleComponent.jsx';
import TableTop from '../../layout/TableTop.jsx';

function SanitaryShafts() {
    const {projectId} = useParams();


    return (
        <>
            <SubTitleComponent>
                <TapwaterIcon /> Sanitærsjakter
            </SubTitleComponent>
            <div className='main-content'>
            <div className="text-container-above-tables no-print">

            </div>
            <TableTop />
            <div className="table-wrapper">
                <table className="fl-table">
                    <thead>
                        <th width="2%">#</th>
                        <th width="10%">Sjakt</th>
                        <th width="10%">Etasje</th>
                        <th width="10%">KV <br/>Noralvannmengde</th>
                        <th width="10%">VV <br/>Noralvannmengde</th>
                        <th width="10%">SPV <br/>Noralvannmengde</th>
                        <th width="10%">KV Cu <br/>mm</th>
                        <th width="10%">VV Cu <br/> mm</th>
                        <th width="10%">SPV 1:60 <br/>mm</th>
                        <th width="10%">SPV Stående <br/>mm</th>
                    </thead>
                    <tbody>
                        <td>Hey</td>
                    </tbody>
                </table>
            </div>
            </div>

        </>
    );
}

export default SanitaryShafts;