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
    startSeason: 2023,
    startWeek: 1,
    endSeason: 2023,
    endWeek: 18,
    breakoutby: '',
    isLoading1: false,
    isLoading2: false,
    filtersModalVisible: false
};

const rushCompReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_RUSH_COMPARISON_START':
            if (action.whichPlayer === 'Player 1') {
                return { ...state, isLoading1: true }
            } else {
                return { ...state, isLoading2: true }
            }
        case 'FETCH_RUSH_COMPARISON_SUCCESS':
            if (action.payload.whichPlayer === 'Player 1') {
                return {
                    ...state,
                    playerData1: action.payload,
                    isLoading1: false,
                }
            } else {
                return {
                    ...state,
                    playerData2: action.payload,
                    isLoading2: false,
                }
            };
        case 'FETCH_RUSH_COMPARISON_FAILURE':
            if (action.payload.whichPlayer === 'Player 1') {
                return { ...state, isLoading1: false, error: action.payload }
            } else {
                return { ...state, isLoading2: false, error: action.payload }
            }
        case 'SET_STATE_RUSH_COMP':
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export default rushCompReducer;