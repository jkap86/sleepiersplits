import axios from 'axios';
import players from '../../player_ids.json';

export const fetchReceivingStats = (e) => async (dispatch, getState) => {
    e.preventDefault();

    const state = getState();

    const { recComp } = state;

    const player_to_find = players.find(p => p.display_name === recComp.playerToSearch?.display_name);

    const player_to_include = players.find(p => p.display_name === recComp.playerToInclude?.display_name);
    const player_to_exclude = players.find(p => p.display_name === recComp.playerToExclude?.display_name);

    if (player_to_find) {
        dispatch({ type: 'FETCH_REC_COMPARISON_START' });

        try {
            const player = await axios.get('/player/recsummary', {
                params: {
                    player_id: player_to_find.gsis_id,
                    include: player_to_include?.gsis_id || 0,
                    exclude: player_to_exclude?.gsis_id || 0,
                    startSeason: recComp.startSeason,
                    startWeek: recComp.startWeek,
                    endSeason: recComp.endSeason,
                    endWeek: recComp.endWeek,
                    breakoutby: recComp.breakoutby === 'QB' ? 'passer_player_id' : recComp.breakoutby
                }
            })
            console.log(player.data)
            const data = {
                ...player.data,
                whichplayer: recComp.whichplayer,
                include: player_to_include?.display_name || '',
                exclude: player_to_exclude?.display_name || '',
                startSeason: recComp.startSeason,
                startWeek: recComp.startWeek,
                endSeason: recComp.endSeason,
                endWeek: recComp.endWeek,
                breakoutby: recComp.breakoutby === 'QB' ? 'passer_player_id' : recComp.breakoutby
            }

            dispatch({
                type: 'FETCH_REC_COMPARISON_SUCCESS',
                payload: data
            })

        } catch (error) {
            dispatch({ type: 'FETCH_REC_COMPARISON_FAILURE', payload: error.message });
        }
    }

}

export const setReceivingCompState = (state_obj) => ({
    type: 'SET_STATE_REC_COMP',
    payload: state_obj
})