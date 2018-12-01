import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';

import SwitchNavigator from './src/components/_Router'

import { createStore, applyMiddleware } from 'redux';
import combinedReducers from './src/reducers';
import thunk from 'redux-thunk';

const store = createStore(combinedReducers, applyMiddleware(thunk));


export default class App extends React.Component {


  render() {
    return (
      <Provider store={store}>
        <SwitchNavigator />
      </Provider>
    );
  }
}