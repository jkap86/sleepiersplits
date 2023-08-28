import Dropdown from './dropdown';
import { useEffect, forwardRef } from 'react';
import players from '../player_ids.json';

const FiltersModal = forwardRef(({
    playerToInclude,
    setPlayerToInclude,
    playerToExclude,
    setPlayerToExclude,
    setFiltersModalVisible,
    breakoutby,
    setBreakoutby
}, ref) => {

    useEffect(() => {
        if (ref.current !== null) {
            ref.current.focus();
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
        // Disable scroll when the component mounts
        document.body.style.overflow = 'hidden';

        // Enable scroll when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    console.log({ playerToInclude })

    return <div className='filters-modal' ref={ref}>
        <i class="fa-solid fa-rectangle-xmark" onClick={() => setFiltersModalVisible(false)}></i>
        <div>
            <label>
                Include
                <Dropdown
                    searched={playerToInclude}
                    setSearched={setPlayerToInclude}
                    list={players}
                />
            </label>
            <label>
                Exclude
                <Dropdown
                    searched={playerToExclude}
                    setSearched={setPlayerToExclude}
                    list={players}
                />
            </label>
            <label>
                Breakout By
                <select value={breakoutby} onChange={(e) => setBreakoutby(e.target.value)}>
                    <option></option>
                    <option>season</option>
                    <option>formation</option>
                    <option>aDot</option>
                    <option>QB</option>
                </select>
            </label>
        </div>
    </div>
})

export default FiltersModal;