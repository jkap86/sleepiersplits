const initialState = {
    whichPlayer: 'Player 1',
    playerToSearch1: '',
    playerToSearch2: '',
    playerToInclude1: [],
    playerToExclude1: [],
    playerToInclude2: [],
    playerToExclude2: [],
    playerData1: {},
    playerData2: {},
    startSeason: 2022,
    startWeek: 1,
    endSeason: 2022,
    endWeek: 18,
    breakoutby: '',
    isLoading: false,
    filtersModalVisible: false
};

const receivingCompReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_REC_COMPARISON_START':
            return { ...state, isLoading: true }
        case 'FETCH_REC_COMPARISON_SUCCESS':
            if (state.whichPlayer === 'Player 1') {
                return {
                    ...state,
                    playerData1: action.payload,
                    isLoading: false,
                }
            } else {
                return {
                    ...state,
                    playerData2: action.payload,
                    isLoading: false,
                }
            };
        case 'FETCH_REC_COMPARISON_FAILURE':
            return { ...state, isLoading: false, error: action.payload }
        case 'SET_STATE_REC_COMP':
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export default receivingCompReducer;