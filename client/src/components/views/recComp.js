import { useSelector, useDispatch } from 'react-redux';
import { setReceivingCompState, fetchReceivingStats } from '../../redux/actions/recCompActions';
import Dropdown from '../dropdown';
import players from '../../player_ids.json';
import { useState, useRef } from 'react';
import FiltersModal from '../filtersModal';
import { loadingIcon } from '../loadingicon';
import headshot from '../../images/headshot.png';
import { useEffect } from 'react';
import { playerSummaryForm } from '../forms';

const RecComp = () => {
    const dispatch = useDispatch();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const {
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
        isLoading1,
        isLoading2
    } = useSelector(state => state.recComp);
    const filtersModalRef = useRef();

    const playerFound1 = players.find(p => p.gsis_id === playerData1.player_id)
    const playerFound2 = players.find(p => p.gsis_id === playerData2.player_id)

    const keys_one = [];
    const keys_two = [];

    const form1 = playerSummaryForm(
        dispatch,
        fetchReceivingStats,
        setReceivingCompState,
        'Player 1',
        playerToSearch1,
        startSeason,
        startWeek,
        endSeason,
        endWeek,
        setDropdownVisible
    )

    const form2 = playerSummaryForm(
        dispatch,
        fetchReceivingStats,
        setReceivingCompState,
        'Player 2',
        playerToSearch2,
        startSeason,
        startWeek,
        endSeason,
        endWeek,
        setDropdownVisible
    )

    return <>
        <div className='form_wrapper one'>
            {form1}
        </div>
        {
            !playerFound1 && !isLoading1
                ? null
                : <div className='form_wrapper two'>
                    {form2}
                </div>
        }

        {
            filtersModalVisible ?
                <FiltersModal
                    ref={filtersModalRef}
                    whichPlayer={filtersModalVisible}
                    playerToSearch={filtersModalVisible === 'Player 1' ? playerToSearch1 : playerToSearch2}
                    playerToInclude={filtersModalVisible === 'Player 1' ? playerToInclude1 : playerToInclude2}
                    setPlayerToInclude={(value) => dispatch(setReceivingCompState(filtersModalVisible === 'Player 1' ? { playerToInclude1: [...playerToInclude1, value] } : { playerToInclude2: [...playerToInclude2, value] }))}
                    removePlayertoInclude={(value) => dispatch(setReceivingCompState(filtersModalVisible === 'Player 1' ? { playerToInclude1: playerToInclude1.filter(pi => pi.gsis_id !== value.gsis_id) } : { playerToInclude2: playerToInclude2.filter(pi => pi.gsis_id !== value.gsis_id) }))}
                    playerToExclude={filtersModalVisible === 'Player 1' ? playerToExclude1 : playerToExclude2}
                    setPlayerToExclude={(value) => dispatch(setReceivingCompState(filtersModalVisible === 'Player 1' ? { playerToExclude1: [...playerToExclude1, value] } : { playerToExclude2: [...playerToExclude2, value] }))}
                    removePlayertoExclude={(value) => dispatch(setReceivingCompState(filtersModalVisible === 'Player 1' ? { playerToExclude1: playerToExclude1.filter(pi => pi.gsis_id !== value.gsis_id) } : { playerToExclude2: playerToExclude2.filter(pi => pi.gsis_id !== value.gsis_id) }))}
                    setFiltersModalVisible={(value) => dispatch(setReceivingCompState({ filtersModalVisible: value }))}
                    breakoutby={breakoutby}
                    setBreakoutby={(value) => dispatch(setReceivingCompState({ breakoutby: value }))}
                    view={'Receiving Comparison'}
                />
                : null
        }
        {
            (dropdownVisible || (!playerFound1 && !playerFound2 && !isLoading1 && !isLoading2))
                ? null
                :
                <>
                    {(playerFound1?.display_name || isLoading1)
                        ? <div className='player-card one'>
                            {
                                (isLoading1)
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
                        (playerFound2?.display_name || isLoading2)
                            ? <div
                                className='player-card two'
                            >
                                {
                                    (isLoading2)
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