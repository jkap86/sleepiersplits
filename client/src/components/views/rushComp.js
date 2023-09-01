import { useSelector, useDispatch } from 'react-redux';
import { setRushCompState, fetchRushingStats } from '../../redux/actions/rushCompActions';
import Dropdown from '../dropdown';
import players from '../../player_ids.json';
import { useState, useRef } from 'react';
import FiltersModal from '../filtersModal';
import { loadingIcon } from '../loadingicon';
import headshot from '../../images/headshot.png';
import { playerSummaryForm } from '../forms';

const RushComp = () => {
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
    } = useSelector(state => state.rushComp);
    const filtersModalRef = useRef();

    const playerFound1 = players.find(p => p.gsis_id === playerData1.player_id)
    const playerFound2 = players.find(p => p.gsis_id === playerData2.player_id)

    const keys_one = [];
    const keys_two = [];

    const form1 = playerSummaryForm(
        dispatch,
        fetchRushingStats,
        setRushCompState,
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
        fetchRushingStats,
        setRushCompState,
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
                    setPlayerToInclude={(value) => dispatch(setRushCompState(filtersModalVisible === 'Player 1' ? { playerToInclude1: [...playerToInclude1, value] } : { playerToInclude2: [...playerToInclude2, value] }))}
                    removePlayertoInclude={(value) => dispatch(setRushCompState(filtersModalVisible === 'Player 1' ? { playerToInclude1: playerToInclude1.filter(pi => pi.gsis_id !== value.gsis_id) } : { playerToInclude2: playerToInclude2.filter(pi => pi.gsis_id !== value.gsis_id) }))}
                    playerToExclude={filtersModalVisible === 'Player 1' ? playerToExclude1 : playerToExclude2}
                    setPlayerToExclude={(value) => dispatch(setRushCompState(filtersModalVisible === 'Player 1' ? { playerToExclude1: [...playerToExclude1, value] } : { playerToExclude2: [...playerToExclude2, value] }))}
                    removePlayertoExclude={(value) => dispatch(setRushCompState(filtersModalVisible === 'Player 1' ? { playerToExclude1: playerToExclude1.filter(pi => pi.gsis_id !== value.gsis_id) } : { playerToExclude2: playerToExclude2.filter(pi => pi.gsis_id !== value.gsis_id) }))}
                    setFiltersModalVisible={(value) => dispatch(setRushCompState({ filtersModalVisible: value }))}
                    breakoutby={breakoutby}
                    setBreakoutby={(value) => dispatch(setRushCompState({ breakoutby: value }))}
                    view={'Rushing Comparison'}

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
                                                        <th>Carries</th>
                                                        <td>{playerData1.carries}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Rush Yds</th>
                                                        <td>{parseInt(playerData1.rushing_yards)?.toLocaleString("en-US")}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>TDs</th>
                                                        <td>{playerData1.rushing_touchdowns}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>YPC</th>
                                                        <td>{(parseInt(playerData1.rushing_yards) / parseInt(playerData1.carries)).toFixed(1)}</td>
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
                                                        <th>Rec Yards</th>
                                                        <td>{playerData1.receiving_yards}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Rec TDs</th>
                                                        <td>{playerData1.receiving_touchdowns}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            {
                                                playerData1.breakout
                                                    ?.filter(breakout => playerData1.breakoutby !== 'down' || ['1', '2', '3', '4'].includes(breakout.down))
                                                    ?.map(breakout => {
                                                        return <table>
                                                            <caption>
                                                                {
                                                                    playerData1.breakoutby === 'down'
                                                                        ? breakout.down === '1'
                                                                            ? '1st Down'
                                                                            : breakout.down === '2'
                                                                                ? '2nd Down'
                                                                                : breakout.down === '3'
                                                                                    ? '3rd Down'
                                                                                    : breakout.down === '4'
                                                                                        ? '4th Down'
                                                                                        : ''
                                                                        : breakout[playerData1.breakoutby]
                                                                }
                                                            </caption>
                                                            <tbody>
                                                                <tr>
                                                                    <th>Games</th>
                                                                    <td>{breakout.games}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Carries</th>
                                                                    <td>{breakout.carries}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Rush Yds</th>
                                                                    <td>{parseInt(breakout.rushing_yards)?.toLocaleString("en-US")}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>TDs</th>
                                                                    <td>{breakout.rushing_touchdowns}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>YPC</th>
                                                                    <td>{(parseInt(breakout.rushing_yards) / parseInt(breakout.carries)).toFixed(1)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Targets</th>
                                                                    <td>{breakout.targets}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Rec</th>
                                                                    <td>{breakout.receptions}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Rec Yards</th>
                                                                    <td>{breakout.receiving_yards}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>Rec TDs</th>
                                                                    <td>{breakout.receiving_touchdowns}</td>
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
                                                            <th>Carries</th>
                                                            <td>{playerData2.carries}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Rush Yds</th>
                                                            <td>{parseInt(playerData2.rushing_yards)?.toLocaleString("en-US")}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>TDs</th>
                                                            <td>{playerData2.rushing_touchdowns}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>YPC</th>
                                                            <td>{(parseInt(playerData2.rushing_yards) / parseInt(playerData2.carries)).toFixed(1)}</td>
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
                                                            <th>Rec Yards</th>
                                                            <td>{playerData2.receiving_yards}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Rec TDs</th>
                                                            <td>{playerData2.receiving_touchdowns}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                {
                                                    playerData2.breakout
                                                        ?.filter(breakout => playerData2.breakoutby !== 'down' || ['1', '2', '3', '4'].includes(breakout.down))
                                                        ?.map(breakout => {
                                                            return <table>
                                                                <caption>
                                                                    {
                                                                        playerData2.breakoutby === 'down'
                                                                            ? breakout.down === '1'
                                                                                ? '1st Down'
                                                                                : breakout.down === '2'
                                                                                    ? '2nd Down'
                                                                                    : breakout.down === '3'
                                                                                        ? '3rd Down'
                                                                                        : breakout.down === '4'
                                                                                            ? '4th Down'
                                                                                            : ''
                                                                            : breakout[playerData2.breakoutby]
                                                                    }
                                                                </caption>
                                                                <tbody>
                                                                    <tr>
                                                                        <th>Games</th>
                                                                        <td>{breakout.games}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Carries</th>
                                                                        <td>{breakout.carries}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Rush Yds</th>
                                                                        <td>{parseInt(breakout.rushing_yards)?.toLocaleString("en-US")}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>TDs</th>
                                                                        <td>{breakout.rushing_touchdowns}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>YPC</th>
                                                                        <td>{(parseInt(breakout.rushing_yards) / parseInt(breakout.carries)).toFixed(1)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Targets</th>
                                                                        <td>{breakout.targets}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Rec</th>
                                                                        <td>{breakout.receptions}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Rec Yards</th>
                                                                        <td>{breakout.receiving_yards}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Rec TDs</th>
                                                                        <td>{breakout.receiving_touchdowns}</td>
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

export default RushComp;