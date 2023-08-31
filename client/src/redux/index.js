import { combineReducers } from 'redux';
import receivingCompReducer from './reducers/recCompReducers';
import receivingTop50Reducer from './reducers/recTop50Reducers';
import rushCompReducer from './reducers/rushCompReducers';

const rootReducer = combineReducers({
    recComp: receivingCompReducer,
    rushComp: rushCompReducer,
    recTop50: receivingTop50Reducer
});

export default rootReducer;