import { combineReducers } from 'redux';
import { items, firstrun } from './reducers';
import { AsyncStorage } from 'react-native';

export default combineReducers({
    items
});
