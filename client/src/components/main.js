
import { useState } from 'react';
import RecComp from './views/recComp';
import RecTop50 from './views/recTop50';
import RushComp from './views/rushComp';

const Main = () => {
    const [view, setView] = useState('Receiving Comparison');

    let display;

    switch (view) {
        case 'Receiving Comparison':
            display = <RecComp />
            break;
        case 'Receiving Top 50':
            display = <RecTop50 />
            break;
        case 'Rushing Comparison':
            display = <RushComp />
            break;
        default:
            break;
    }

    return <div className='player-container' >
        <select className='nav' value={view} onChange={(e) => setView(e.target.value)}>
            <option>Receiving Comparison</option>
            <option>Rushing Comparison</option>
            <option>Receiving Top 50</option>
        </select>
        <div className="player-search">
            <h1>Sleepier Splits</h1>
        </div>
        {display}
    </div>
}

export default Main;