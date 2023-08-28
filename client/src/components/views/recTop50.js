import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { loadingIcon } from '../loadingicon';
import players from '../../player_ids.json';
import { fetchTop50, setReceivingTop50State } from '../../redux/actions/recTop50Actions';

const RecTop50 = () => {
    const dispatch = useDispatch();
    const { isLoading, category, statistic, startSeason, startWeek, endSeason, endWeek, top50 } = useSelector(state => state.recTop50);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return <>
        <form onSubmit={(e) => dispatch(fetchTop50(e))}>
            <div>
                <label>
                    Category
                    <select value={category} onChange={(e) => dispatch(setReceivingTop50State({ category: e.target.value }))}>
                        <option>receiving</option>
                    </select>
                </label>
                <label>
                    Statistic
                    <select value={statistic} onChange={(e) => dispatch(setReceivingTop50State({ statistic: e.target.value }))}>
                        <option value={'receiving_yards'}>receiving yards</option>
                        <option value={'targets'}>targets</option>
                    </select>
                </label>
            </div>
            <div className='range-container'>
                <div className='range'>
                    <label>
                        FROM
                        <div>
                            <select value={startSeason} onChange={(e) => dispatch(setReceivingTop50State({ startSeason: e.target.value }))}>
                                <option>2022</option>
                                <option>2021</option>
                                <option>2020</option>
                                <option>2019</option>
                                <option>2018</option>
                                <option>2017</option>
                                <option>2016</option>
                            </select>
                            <em>Week</em>
                            <select value={startWeek} onChange={(e) => dispatch(setReceivingTop50State({ startWeek: e.target.value }))}>
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
                            <select value={endSeason} onChange={(e) => dispatch(setReceivingTop50State({ endSeason: e.target.value }))}>
                                <option>2022</option>
                                <option>2021</option>
                                <option>2020</option>
                                <option>2019</option>
                                <option>2018</option>
                                <option>2017</option>
                                <option>2016</option>
                            </select>
                            <em>Week</em>
                            <select value={endWeek} onChange={(e) => dispatch(setReceivingTop50State({ endWeek: e.target.value }))}>
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
            <button type="submit" disabled={isLoading}>Search</button>
        </form>
        {
            isLoading
                ? loadingIcon
                : (top50.top50?.length > 0)
                    ? <div className='top50'>
                        <table>
                            <caption>
                                Top 50 in {top50.statistic}
                                <br />
                                {
                                    `
                                                ${top50.startSeason} Week ${top50.startWeek}
                                                -
                                                ${top50.endSeason} Week ${top50.endWeek}
                                            `
                                }
                            </caption>
                            <thead>
                                <tr>
                                    <th colSpan={2}>Rnk</th>
                                    <th colSpan={7}>Player</th>
                                    <th colSpan={2}>Tgts</th>
                                    <th colSpan={2}>Rec</th>
                                    <th colSpan={4}>Rec Yd</th>
                                    <th colSpan={2}>TDs</th>
                                    <th colSpan={3}>aDot</th>
                                    <th colSpan={3}>Tgt %</th>
                                    <th colSpan={3}>YPRR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    top50.top50
                                        ?.map((player, index) => {
                                            const player_name = players.find(p => p.gsis_id === player.receiver_player_id)?.display_name
                                            return <tr key={player.receiver_player_id}>
                                                <td colSpan={2}>
                                                    {index + 1}
                                                </td>
                                                <td colSpan={7}>
                                                    {player_name}
                                                </td>
                                                <td colSpan={2}>
                                                    {player.targets}
                                                </td>
                                                <td colSpan={2}>
                                                    {player.complete_pass}
                                                </td>
                                                <td colSpan={4}>
                                                    {parseInt(player.receiving_yards)?.toLocaleString('en-US')}
                                                </td>
                                                <td colSpan={2}>
                                                    {player.touchdowns}
                                                </td>
                                                <td colSpan={3}>
                                                    {(parseInt(player.air_yards) / parseInt(player.targets)).toFixed(1)}
                                                </td>
                                                <td colSpan={3}>
                                                    {'-'}
                                                </td>
                                                <td colSpan={3}>
                                                    {'-'}
                                                </td>
                                            </tr>
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                    : null

        }
    </>
}

export default RecTop50;