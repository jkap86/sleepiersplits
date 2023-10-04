import axios from 'axios';
import players from '../../player_ids.json';

export const fetchReceivingStats = (e, whichPlayer) => async (dispatch, getState) => {

    e.preventDefault();

    const state = getState();

    const { recComp } = state;

    const player_to_find = players
        .find(p => (whichPlayer === 'Player 1' && p.display_name === recComp.playerToSearch1?.display_name)
            || (whichPlayer === 'Player 2' && p.display_name === recComp.playerToSearch2?.display_name)
        );

    const include = whichPlayer === 'Player 1' ? recComp.playerToInclude1 : recComp.playerToInclude2;
    const exclude = whichPlayer === 'Player 1' ? recComp.playerToExclude1 : recComp.playerToExclude2;

    console.log(recComp.playerToInclude1)

    if (player_to_find) {
        dispatch({ type: 'FETCH_REC_COMPARISON_START', whichPlayer: whichPlayer });

        try {
            const player = await axios.post('/player/recsummary', {

                player_id: player_to_find.gsis_id,
                include: include?.length > 0 ? include : ['0'],
                exclude: exclude?.length > 0 ? exclude : ['0'],
                startSeason: recComp.startSeason,
                startWeek: recComp.startWeek,
                endSeason: recComp.endSeason,
                endWeek: recComp.endWeek,
                breakoutby: recComp.breakoutby === 'QB' ? 'passer_player_id' : recComp.breakoutby,

            })
            console.log(player.data)
            const data = {
                ...player.data,
                startSeason: recComp.startSeason,
                startWeek: recComp.startWeek,
                endSeason: recComp.endSeason,
                endWeek: recComp.endWeek,
                breakoutby: recComp.breakoutby === 'QB' ? 'passer_player_id' : recComp.breakoutby,
                whichPlayer: whichPlayer
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