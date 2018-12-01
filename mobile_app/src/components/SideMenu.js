/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import PropTypes from 'prop-types';
 import React, {PureComponent} from 'react';
 import {NavigationActions} from 'react-navigation';
 import {ScrollView, Text, View, TouchableOpacity, AsyncStorage, Image, Linking, Platform} from 'react-native';
 import styles from './_styles'
 import { connect } from 'react-redux';
 
 import { DrawerActions } from 'react-navigation';


 class SideMenu extends PureComponent {


  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };


  render () {
    return (
      <View style={{flex: 1, marginTop: 50}}>        
        <View style={{ flex: 1, flexDirection: 'column'}}>
          <View>
            <TouchableOpacity 
            style={{paddingLeft: 20, paddingBottom: 20}}
            onPress={() => {
              this.props.navigation.navigate('DrawerClose')
              this.props.navigation.navigate('Calendar')
            }}>
            <Text style={styles.sidebarText}>Calendar</Text>
            
            </TouchableOpacity>
            <View style={styles.sideMenuSeparator} />
          </View>

          <View>
            <TouchableOpacity 
            style={{paddingLeft: 20, paddingBottom: 20}}
            onPress={() => {
              this.props.navigation.navigate('DrawerClose')
              this.props.navigation.navigate('Settings')
            }}>
            <Text style={styles.sidebarText}>Settings</Text>
            
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>

          <TouchableOpacity 
              style={[styles.materialButtonLong, { position: 'absolute', bottom: 10, marginLeft: 5}]} 
              onPress={() => Platform.OS === 'ios' ? Linking.openURL('sms: &body=https://itunes.apple.com/app/id1378071021') : Linking.openURL('sms:?body=https://play.google.com/store/apps/details?id=com.pokedoc.iamoff')} >
            <Text style={[styles.materialButtonTextLong]}>
              Invite Friends
            </Text>
          </TouchableOpacity> 
        
        </View>
        
        <View style={{height: 100, backgroundColor: '#ff0081'}}>
          <View style={{flexDirection: 'row'}}>
            <Image style={{height: 70, width: 70}} source={require('../../assets/logo.png')} />
          </View>
        </View>
        
        </View>
        );
      }
    }


    const mapStateToProps = (state) => {
      return {
        items: state.items,
      };
    };

    const mapDispatchToProps = (dispatch) => {
      return {
        fetchData: (phone) => dispatch(fetchData(phone))
      };
    };

    export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);