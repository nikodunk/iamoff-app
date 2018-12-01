import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import { createStackNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { getToken } from '../actions/actions';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AuthScreen from './AuthScreen'
import LoginScreen from './LoginScreen'
import CalendarScreen from './CalendarScreen'
import RegisterScreen from './RegisterScreen'
import SettingsScreen from './SettingsScreen'
import SideMenu from './SideMenu'

import styles from './_styles'


const SignedInRouter = createDrawerNavigator({
    Calendar: { screen: CalendarScreen },
    Settings: { screen: SettingsScreen }
  },
  {
    contentComponent: ({ navigation }) => (<SideMenu navigation={navigation} />),
  }
)


const SignedOutRouter = createStackNavigator({
  AuthScreen: { screen: AuthScreen, navigationOptions: {title: 'Welcome', header: null} },
  LoginScreen: { screen: LoginScreen, navigationOptions:{ title: 'Sign Up', header: null} },
  RegisterScreen: { screen: RegisterScreen, navigationOptions:{ title: 'Sign Up', header: null} }
  });



class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('jwt');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };
  render() {
    return (
      <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
        <ActivityIndicator />
      </View>
    );
  }
}

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: SignedInRouter,
    Auth: SignedOutRouter,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

