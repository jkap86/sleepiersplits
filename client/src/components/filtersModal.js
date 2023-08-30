import Dropdown from './dropdown';
import { useEffect, forwardRef, useState } from 'react';
import players from '../player_ids.json';

const FiltersModal = forwardRef(({
    playerToSearch,
    playerToInclude,
    setPlayerToInclude,
    removePlayertoInclude,
    playerToExclude,
    setPlayerToExclude,
    removePlayertoExclude,
    setFiltersModalVisible,
    breakoutby,
    setBreakoutby
}, ref) => {
    const [playerToIncludeSearched, setPlayerToIncludeSearched] = useState('');
    const [playerToExcludeSearched, setPlayerToExcludeSearched] = useState('');

    console.log({ playerToInclude, playerToExclude })

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

    useEffect(() => {
        if (playerToIncludeSearched?.gsis_id) {
            setPlayerToInclude(playerToIncludeSearched)
            setPlayerToIncludeSearched('')
        }
    }, [playerToIncludeSearched])

    useEffect(() => {
        if (playerToExcludeSearched?.gsis_id) {
            setPlayerToExclude(playerToExcludeSearched)
            setPlayerToExcludeSearched('')
        }
    }, [playerToExcludeSearched])

    return <div className='filters-modal' ref={ref}>
        <i class="fa-solid fa-rectangle-xmark" onClick={() => setFiltersModalVisible(false)}></i>
        <div>
            <div className='label'>
                Include
                <div>
                    {
                        playerToInclude.map(player => <p key={player.gsis_id}>{player.display_name}<button type="reset" onClick={() => removePlayertoInclude(player)} type='button'>x</button></p>)
                    }
                </div>
                <Dropdown
                    searched={playerToIncludeSearched}
                    setSearched={setPlayerToIncludeSearched}
                    list={
                        players
                            .filter(player => {
                                return (
                                    player.gsis_id !== playerToSearch?.gsis_id
                                    &&
                                    !playerToInclude.find(pi => pi.gsis_id === player.gsis_id)
                                    && !playerToExclude.find(pe => pe.gsis_id === player.gsis_id)

                                )
                            })
                    }
                    disabled={playerToInclude.length >= 3}
                />
            </div>
            <div className='label'>
                Exclude
                <div>
                    {
                        playerToExclude.map(player => <p key={player.gsis_id}>{player.display_name}<button type="reset" onClick={() => removePlayertoExclude(player)} type='button'>x</button></p>)
                    }
                </div>
                <Dropdown
                    searched={playerToExcludeSearched}
                    setSearched={setPlayerToExcludeSearched}
                    list={
                        players
                            .filter(player => {
                                return (
                                    player.gsis_id !== playerToSearch?.gsis_id
                                    &&
                                    !playerToInclude.find(pi => pi.gsis_id === player.gsis_id)
                                    && !playerToExclude.find(pe => pe.gsis_id === player.gsis_id)
                                )
                            })
                    }
                    disabled={playerToExclude.length >= 3}
                />
            </div>
            <div className='label'>
                Breakout By
                <select value={breakoutby} onChange={(e) => setBreakoutby(e.target.value)}>
                    <option></option>
                    <option>season</option>
                    <option>formation</option>
                    <option>aDot</option>
                    <option>QB</option>
                </select>
            </div>
        </div>
    </div>
})

export default FiltersModal;