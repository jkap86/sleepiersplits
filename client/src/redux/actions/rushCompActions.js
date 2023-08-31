import axios from 'axios';
import players from '../../player_ids.json';

export const fetchRushingStats = (e) => async (dispatch, getState) => {
    e.preventDefault();

    const state = getState();

    const { rushComp } = state;

    const player_to_find = players
        .find(p => (rushComp.whichPlayer === 'Player 1' && p.display_name === rushComp.playerToSearch1?.display_name)
            || (rushComp.whichPlayer === 'Player 2' && p.display_name === rushComp.playerToSearch2?.display_name)
        );

    const include = rushComp.whichPlayer === 'Player 1' ? rushComp.playerToInclude1 : rushComp.playerToInclude2;
    const exclude = rushComp.whichPlayer === 'Player 1' ? rushComp.playerToExclude1 : rushComp.playerToExclude2;



    if (player_to_find) {
        dispatch({ type: 'FETCH_RUSH_COMPARISON_START' });

        try {
            const player = await axios.get('/player/rushsummary', {
                params: {
                    player_id: player_to_find.gsis_id,
                    include: include?.length > 0 ? include : ['0'],
                    exclude: exclude?.length > 0 ? exclude : ['0'],
                    startSeason: rushComp.startSeason,
                    startWeek: rushComp.startWeek,
                    endSeason: rushComp.endSeason,
                    endWeek: rushComp.endWeek,
                    breakoutby: rushComp.breakoutby === 'QB' ? 'passer_player_id' : rushComp.breakoutby,
                }
            })
            console.log(player.data)
            const data = {
                ...player.data,
                whichplayer: rushComp.whichplayer,
                startSeason: rushComp.startSeason,
                startWeek: rushComp.startWeek,
                endSeason: rushComp.endSeason,
                endWeek: rushComp.endWeek,
                breakoutby: rushComp.breakoutby === 'QB' ? 'passer_player_id' : rushComp.breakoutby
            }

            dispatch({
                type: 'FETCH_RUSH_COMPARISON_SUCCESS',
                payload: data
            })

        } catch (error) {
            dispatch({ type: 'FETCH_RUSH_COMPARISON_FAILURE', payload: error.message });
        }
    }

}

export const setRushCompState = (state_obj) => ({
    type: 'SET_STATE_RUSH_COMP',
    payload: state_obj
})