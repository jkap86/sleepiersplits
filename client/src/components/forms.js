import players from '../player_ids.json';
import Dropdown from './dropdown';

export const playerSummaryForm = (
    dispatch,
    fetchStats,
    setState,
    whichPlayer,
    playerToSearch,
    startSeason,
    startWeek,
    endSeason,
    endWeek,
    setDropdownVisible
) => {

    return <>
        <form onSubmit={(e) => dispatch(fetchStats(e, whichPlayer))}>
            <div>
                <label>
                    <span>{whichPlayer}</span>
                    <Dropdown
                        searched={playerToSearch}
                        setSearched={(value) => dispatch(setState(whichPlayer === 'Player 1' ? { playerToSearch1: value } : { playerToSearch2: value }))}
                        list={players}
                        sendDropdownVisible={(data) => setDropdownVisible(data)}
                        whichPlayer={whichPlayer}
                    />

                </label>
                <div className='icon_wrapper click' onClick={() => dispatch(setState({ filtersModalVisible: whichPlayer }))}>
                    <p className='icon_title'></p>
                    <i className="fa-solid fa-filter"></i>
                </div>
            </div>
            <div className='range-container'>
                <table className='range'>
                    <thead>
                        <tr>
                            <th colSpan={2}>FROM</th>
                            <th colSpan={2}>TO</th>
                        </tr>
                        <tr>
                            <th>season</th>
                            <th>week</th>
                            <th>season</th>
                            <th>week</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select value={startSeason} onChange={(e) => dispatch(setState({ startSeason: e.target.value }))}>
                                    <option>2022</option>
                                    <option>2021</option>
                                    <option>2020</option>
                                    <option>2019</option>
                                    <option>2018</option>
                                    <option>2017</option>
                                    <option>2016</option>
                                </select>
                            </td>
                            <td>
                                <select value={startWeek} onChange={(e) => dispatch(setState({ startWeek: e.target.value }))}>
                                    {
                                        Array.from(Array(18).keys()).map(key => {
                                            return <option key={key + 1}>
                                                {key + 1}
                                            </option>
                                        })
                                    }
                                </select>
                            </td>
                            <td>
                                <select value={endSeason} onChange={(e) => dispatch(setState({ endSeason: e.target.value }))}>
                                    <option>2022</option>
                                    <option>2021</option>
                                    <option>2020</option>
                                    <option>2019</option>
                                    <option>2018</option>
                                    <option>2017</option>
                                    <option>2016</option>
                                </select>
                            </td>
                            <td>
                                <select value={endWeek} onChange={(e) => dispatch(setState({ endWeek: e.target.value }))}>
                                    {
                                        Array.from(Array(18).keys()).map(key => {
                                            return <option key={key + 1}>
                                                {key + 1}
                                            </option>
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button type="submit" >Search</button>
        </form>
    </>
}

