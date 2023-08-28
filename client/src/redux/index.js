import { combineReducers } from 'redux';
import receivingCompReducer from './reducers/recCompReducers';
import receivingTop50Reducer from './reducers/recTop50Reducers';

const rootReducer = combineReducers({
    recComp: receivingCompReducer,
    recTop50: receivingTop50Reducer
});

export default rootReducer;