import axios from 'axios';


export const fetchTop50 = (e) => async (dispatch, getState) => {
    e.preventDefault();


    dispatch({ type: 'FETCH_REC_TOP50_START' });

    const state = getState();

    const { recTop50 } = state;

    try {
        const topwr = await axios.get('/receiving/top50', {
            params: {
                category: recTop50.category,
                statistic: recTop50.statistic,
                startSeason: recTop50.startSeason,
                startWeek: recTop50.startWeek,
                endSeason: recTop50.endSeason,
                endWeek: recTop50.endWeek
            }
        })

        const data = {
            ...topwr.data,

        }

        dispatch({
            type: 'FETCH_REC_TOP50_SUCCESS',
            payload: data
        })
    } catch (err) {
        console.log(err)
    }
}

export const setReceivingTop50State = (state_obj) => ({
    type: 'SET_STATE_REC_TOP50',
    payload: state_obj
})