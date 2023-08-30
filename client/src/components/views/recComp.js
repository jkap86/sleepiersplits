import { useSelector, useDispatch } from 'react-redux';
import { setReceivingCompState, fetchReceivingStats } from '../../redux/actions/recCompActions';
import Dropdown from '../dropdown';
import players from '../../player_ids.json';
import { useState, useRef } from 'react';
import FiltersModal from '../filtersModal';
import { loadingIcon } from '../loadingicon';
import headshot from '../../images/headshot.png';
import { useEffect } from 'react';

const RecComp = () => {
    const dispatch = useDispatch();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const {
        whichPlayer,
        playerToSearch1,
        playerToSearch2,
        playerToInclude1,
        playerToExclude1,
        playerToInclude2,
        playerToExclude2,
        breakoutby,
        startSeason,
        startWeek,
        endSeason,
        endWeek,
        filtersModalVisible,
        playerData1,
        playerData2,
        isLoading
    } = useSelector(state => state.recComp);
    const filtersModalRef = useRef();

    const playerFound1 = players.find(p => p.gsis_id === playerData1.player_id)
    const playerFound2 = players.find(p => p.gsis_id === playerData2.player_id)

    const keys_one = [];
    const keys_two = [];



    return <>
        <form onSubmit={(e) => dispatch(fetchReceivingStats(e))}>
            <div>
                <label>
                    <span onClick={() => dispatch(setReceivingCompState(whichPlayer === 'Player 1' ? { whichPlayer: 'Player 2' } : { whichPlayer: 'Player 1' }))}>{whichPlayer}</span>
                    <Dropdown
                        searched={whichPlayer === 'Player 1' ? playerToSearch1 : playerToSearch2}
                        setSearched={(value) => whichPlayer === 'Player 1'
                            ? dispatch(setReceivingCompState({ playerToSearch1: value }))
                            : dispatch(setReceivingCompState({ playerToSearch2: value }))
                        }
                        list={players}
                        sendDropdownVisible={(data) => setDropdownVisible(data)}
                    />
                    <i onClick={() => dispatch(setReceivingCompState({ filtersModalVisible: true }))} className="fa-solid fa-filter"></i>
                </label>
            </div>
            <div className='range-container'>
                <div className='range'>
                    <label>
                        FROM
                        <div>
                            <select value={startSeason} onChange={(e) => dispatch(setReceivingCompState({ startSeason: e.target.value }))}>
                                <option>2022</option>
                                <option>2021</option>
                                <option>2020</option>
                                <option>2019</option>
                                <option>2018</option>
                                <option>2017</option>
                                <option>2016</option>
                            </select>
                            <em>Week</em>
                            <select value={startWeek} onChange={(e) => dispatch(setReceivingCompState({ startWeek: e.target.value }))}>
                                {
                                    Array.from(Array(18).keys()).map(key => {
                                        return <option key={key + 1}>
                                            {key + 1}
                                        </option>
                                    })
                                }
                            </select>
                        </div>
                    </label>
                </div>
                <div className='range'>
                    <label>
                        TO
                        <div>
                            <select value={endSeason} onChange={(e) => dispatch(setReceivingCompState({ endSeason: e.target.value }))}>
                                <option>2022</option>
                                <option>2021</option>
                                <option>2020</option>
                                <option>2019</option>
                                <option>2018</option>
                                <option>2017</option>
                                <option>2016</option>
                            </select>
                            <em>Week</em>
                            <select value={endWeek} onChange={(e) => dispatch(setReceivingCompState({ endWeek: e.target.value }))}>
                                {
                                    Array.from(Array(18).keys()).map(key => {
                                        return <option key={key + 1}>
                                            {key + 1}
                                        </option>
                                    })
                                }
                            </select>
                        </div>
                    </label>
                </div>
            </div>
            <button type="submit" >Search</button>
        </form>
        {
            filtersModalVisible ?
                <FiltersModal
                    ref={filtersModalRef}
                    whichPlayer={whichPlayer}
                    playerToSearch={whichPlayer === 'Player 1' ? playerToSearch1 : playerToSearch2}
                    playerToInclude={whichPlayer === 'Player 1' ? playerToInclude1 : playerToInclude2}
                    setPlayerToInclude={(value) => dispatch(setReceivingCompState(whichPlayer === 'Player 1' ? { playerToInclude1: [...playerToInclude1, value] } : { playerToInclude2: [...playerToInclude2, value] }))}
                    removePlayertoInclude={(value) => dispatch(setReceivingCompState(whichPlayer === 'Player 1' ? { playerToInclude1: playerToInclude1.filter(pi => pi.gsis_id !== value.gsis_id) } : { playerToInclude2: playerToInclude2.filter(pi => pi.gsis_id !== value.gsis_id) }))}
                    playerToExclude={whichPlayer === 'Player 1' ? playerToExclude1 : playerToExclude2}
                    setPlayerToExclude={(value) => dispatch(setReceivingCompState(whichPlayer === 'Player 1' ? { playerToExclude1: [...playerToExclude1, value] } : { playerToExclude2: [...playerToExclude2, value] }))}
                    removePlayertoExclude={(value) => dispatch(setReceivingCompState(whichPlayer === 'Player 1' ? { playerToExclude1: playerToExclude1.filter(pi => pi.gsis_id !== value.gsis_id) } : { playerToExclude2: playerToExclude2.filter(pi => pi.gsis_id !== value.gsis_id) }))}
                    setFiltersModalVisible={(value) => dispatch(setReceivingCompState({ filtersModalVisible: value }))}
                    breakoutby={breakoutby}
                    setBreakoutby={(value) => dispatch(setReceivingCompState({ breakoutby: value }))}

                />
                : null
        }
        {
            (dropdownVisible || (!playerFound1 && !playerFound2 && !isLoading))
                ? null
                :
                <>
                    {(playerFound1?.display_name || (whichPlayer === 'Player 1' && isLoading))
                        ? <div className='player-card one'>
                            {
                                (whichPlayer === 'Player 1' && isLoading)
                                    ? loadingIcon
                                    : <>
                                        <h1>
                                            {
                                                playerFound1
                                                && <img
                                                    alt='headshot'
                                                    src={playerFound1?.headshot || headshot}
                                                />
                                            }
                                            {playerFound1?.display_name}
                                        </h1>
                                        <h3>
                                            <span>
                                                {playerData1.startSeason && (playerData1.startSeason + ' Week ' + playerData1.startWeek)}&nbsp;
                                                -&nbsp;
                                                {playerData1.endSeason + ' Week ' + playerData1.endWeek}
                                            </span>
                                        </h3>
                                        <h3>
                                            <span>
                                                <div>
                                                    {playerData1.include.find(p => p.gsis_id) && 'With: ' + playerData1.include.map(p => ' ' + p.display_name)}
                                                </div>
                                                <div>
                                                    {playerData1.exclude.find(p => p.gsis_id) && 'Without: ' + playerData1.exclude.map(p => ' ' + p.display_name)}
                                                </div>
                                            </span>
                                        </h3>
                                        <h2>
                                            <table>
                                                <caption>TOTALS</caption>
                                                <tbody>
                                                    <tr>
                                                        <th>Games</th>
                                                        <td>{playerData1.games}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Plays</th>
                                                        <td>{playerData1.routes}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Targets</th>
                                                        <td>{playerData1.targets}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Rec</th>
                                                        <td>{playerData1.receptions}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>yards</th>
                                                        <td>{parseInt(playerData1.receiving_yards)?.toLocaleString("en-US")}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>tds</th>
                                                        <td>{playerData1.touchdowns}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Tgt Share</th>
                                                        <td>{parseInt(playerData1.routes) > 0 && parseFloat(playerData1.targets / playerData1.routes)?.toLocaleString("en-US", { maximumFractionDigits: 3 })}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>aDot</th>
                                                        <td>{parseInt(playerData1.targets) > 0 && parseFloat(playerData1.air_yards / playerData1.targets)?.toLocaleString("en-US", { maximumFractionDigits: 1 })}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>YPRR</th>
                                                        <td>{parseInt(playerData1.routes) > 0 && parseFloat(playerData1.receiving_yards / playerData1.routes)?.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            {
                                                playerData1.player_breakoutby?.map(key => {
                                                    return <table>
                                                        <caption>{
                                                            playerData1.breakoutby === 'aDot'
                                                                ? key['air_yards_range']
                                                                : playerData1.breakoutby === 'passer_player_id'
                                                                    ? players.find(p => p.gsis_id === key.passer_player_id)?.display_name
                                                                    : key[playerData1.breakoutby]
                                                        }</caption>
                                                        <tbody>
                                                            <tr>
                                                                <th>Games</th>
                                                                <td>{key.games}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Plays</th>
                                                                <td>{key.routes}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Targets</th>
                                                                <td>{key.targets}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Rec</th>
                                                                <td>{key.receptions}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>yards</th>
                                                                <td>{parseInt(key.receiving_yards)?.toLocaleString("en-US")}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>tds</th>
                                                                <td>{key.touchdowns}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Tgt Share</th>
                                                                <td>{parseInt(key.routes) > 0 && parseFloat(key.targets / key.routes)?.toLocaleString("en-US", { maximumFractionDigits: 3 })}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>aDot</th>
                                                                <td>{parseInt(key.targets) > 0 && parseFloat(key.air_yards / key.targets)?.toLocaleString("en-US", { maximumFractionDigits: 1 })}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>YPRR</th>
                                                                <td>{parseInt(key.routes) > 0 && parseFloat(key.receiving_yards / key.routes)?.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                })

                                            }

                                        </h2>
                                    </>
                            }
                        </div>
                        : null
                    }
                    {
                        (playerFound2?.display_name || (whichPlayer === 'Player 2' && isLoading))
                            ? <div
                                className='player-card two'
                            >
                                {
                                    (whichPlayer === 'Player 2' && isLoading)
                                        ? loadingIcon
                                        : <>
                                            <h1>
                                                {
                                                    playerFound2
                                                    && <img
                                                        alt='headshot'
                                                        src={playerFound2?.headshot || headshot}
                                                    />
                                                }
                                                {playerFound2?.display_name}
                                            </h1>
                                            <h3>
                                                <span>
                                                    {playerData2.startSeason && (playerData2.startSeason + ' Week ' + playerData2.startWeek)}&nbsp;
                                                    -&nbsp;
                                                    {playerData2.endSeason + ' Week ' + playerData2.endWeek}
                                                </span>
                                            </h3>
                                            <h3>
                                                <span>
                                                    <div>
                                                        {playerData2.include.find(p => p.gsis_id) && 'With: ' + playerData2.include.map(p => ' ' + p.display_name)}
                                                    </div>
                                                    <div>
                                                        {playerData2.exclude.find(p => p.gsis_id) && 'Without: ' + playerData2.exclude.map(p => ' ' + p.display_name)}
                                                    </div>
                                                </span>
                                            </h3>
                                            <h2>
                                                <table>
                                                    <caption>TOTALS</caption>
                                                    <tbody>
                                                        <tr>
                                                            <th>Games</th>
                                                            <td>{playerData2.games}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Plays</th>
                                                            <td>{playerData2.routes}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Targets</th>
                                                            <td>{playerData2.targets}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Rec</th>
                                                            <td>{playerData2.receptions}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>yards</th>
                                                            <td>{parseInt(playerData2.receiving_yards)?.toLocaleString("en-US")}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>tds</th>
                                                            <td>{playerData2.touchdowns}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Tgt Share</th>
                                                            <td>{parseInt(playerData2.routes) > 0 && parseFloat(playerData2.targets / playerData2.routes)?.toLocaleString("en-US", { maximumFractionDigits: 3 })}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>aDot</th>
                                                            <td>{parseInt(playerData2.targets) > 0 && parseFloat(playerData2.air_yards / playerData2.targets)?.toLocaleString("en-US", { maximumFractionDigits: 1 })}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>YPRR</th>
                                                            <td>{parseInt(playerData2.routes) > 0 && parseFloat(playerData2.receiving_yards / playerData2.routes)?.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                {
                                                    playerData2.player_breakoutby?.map(key => {
                                                        return <table>
                                                            <caption>{
                                                                playerData2.breakoutby === 'aDot'
                                                                    ? key['air_yards_range']
                                                                    : playerData2.breakoutby === 'passer_player_id'
                                                                        ? players.find(p => p.gsis_id === key.passer_player_id)?.display_name
                                                                        : key[playerData2.breakoutby]
                                                            }</caption>
                                                            <tbody>
                                                                <tr>
                                                                    <th>Games</th>
                                                                    <td>{key.games}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Plays</th>
                                                                    <td>{key.routes}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Targets</th>
                                                                    <td>{key.targets}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Rec</th>
                                                                    <td>{key.receptions}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>yards</th>
                                                                    <td>{parseInt(key.receiving_yards)?.toLocaleString("en-US")}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>tds</th>
                                                                    <td>{key.touchdowns}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Tgt Share</th>
                                                                    <td>{parseInt(key.routes) > 0 && parseFloat(key.targets / key.routes)?.toLocaleString("en-US", { maximumFractionDigits: 3 })}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>aDot</th>
                                                                    <td>{parseInt(key.targets) > 0 && parseFloat(key.air_yards / key.targets)?.toLocaleString("en-US", { maximumFractionDigits: 1 })}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>YPRR</th>
                                                                    <td>{parseInt(key.routes) > 0 && parseFloat(key.receiving_yards / key.routes)?.toLocaleString("en-US", { maximumFractionDigits: 2 })}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    })

                                                }

                                            </h2>
                                        </>
                                }
                            </div>
                            : null
                    }
                </>
        }
    </>
}

export default RecComp;