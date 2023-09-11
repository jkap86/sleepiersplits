const initialState = {
    startSeason: 2023,
    startWeek: 1,
    endSeason: 2023,
    endWeek: 18,
    category: 'receiving',
    statistic: 'receiving_yards',
    top50: {},
}


const receivingTop50Reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_REC_TOP50_START':
            return { ...state, isLoading: true }
        case 'FETCH_REC_TOP50_SUCCESS':
            return {
                ...state,
                top50: action.payload,
                isLoading: false
            };
        case 'FETCH_REC_TOP50_FAILURE':
            return { ...state, isLoading: false, error: action.payload }
        case 'SET_STATE_REC_TOP50':
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export default receivingTop50Reducer;