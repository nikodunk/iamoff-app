import React from 'react';
import {  StyleSheet, 
          Text, 
          View, 
          TouchableOpacity, 
          StatusBar, 
          AsyncStorage, 
          ActivityIndicator, 
          FlatList, 
          Linking, 
          Image, 
          ImageBackground,
          TextInput} from 'react-native';
import { connect } from 'react-redux';
import { alterUsergroup } from '../actions/actions';
import styles from './_styles'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';

class SettingsScreen extends React.Component {
      

      constructor(props) {
        super(props);
        this.state = {
          usergroup: '',
          phoneNo: ''
        };
      }
      
      componentDidMount() {
          AsyncStorage.getItem('usergroup').then((res) => {
              this.setState({usergroup: res});
                  })
          AsyncStorage.getItem('phone').then((res) => {
              this.setState({phoneNo: res}) 
                  })

      }

      _changeGroup(){
        this.props.alterUsergroup(this.state.phoneNo, this.state.usergroup)
            .then((res) => {
              console.log('result of changegroup',res)
              if(res === 'worked'){
                  AsyncStorage.setItem('usergroup', this.state.usergroup )
                    .then(() => { AsyncStorage.setItem('phone', this.state.phoneNo).then((res) => {this.props.navigation.navigate('Calendar')})})
                }
            })
      }


      _signOutAsync = async () => {
        await AsyncStorage.clear();
        await this.setState({
          selectedDate: '',
          markedDates: {},
          markedDatesNoSelection: {} });
        this.props.navigation.navigate('Auth');
      };

      render() {
          return (
              <ImageBackground source={require('../../assets/2.jpg')} style={[styles.loginContainer, { flex: 1, width: '100%'}]}>
                <View style={styles.container}>
                  <StatusBar
                     barStyle="dark-content"
                   />
                      <View style={styles.shadowBox}>
                            <View style={{marginTop: 45, marginBottom: 15}}>
                              <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} >
                                <View style={{flexDirection: 'row'}}>
                                  <Icon name={"bars"} 
                                        size={20} 
                                        color={'darkgrey'}
                                        style={{marginLeft: 15, marginTop: 6, marginRight: 10 }} />
                                  <Text style={styles.calendarText}>Settings</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                      </View>
                      
                      <View style={{flex: 1, alignItems: 'center'}}>
                          
                          <Text></Text>
                          <Text></Text>
                          <Text></Text>
                          <Text style={styles.subtitle}>
                              Group Code:
                          </Text>
                          <Text></Text>
                          <Text>{this.state.usergroup}</Text>
                          <Text></Text>
                          <Text></Text>

                          <Text>Change Group Code:</Text>
                          <View style={{flexDirection:'row', alignItems: 'center'}}>
                            
                            <TextInput 
                              underlineColorAndroid="transparent"
                              style={styles.input}
                              placeholder={'newgroupcode'}
                              autoCorrect={false}
                              autoCapitalize={'none'}
                              onChangeText={(text) => {  this.setState({'usergroup': text}) }} 
                            />
                            <TouchableOpacity style={[{marginLeft: 5, maxWidth: 100, maxHeight: 40, backgroundColor: '#ff0081'}, styles.materialButtonLong]} onPress={() => this._changeGroup()} >
                              <Text 
                                style={styles.materialButtonTextLong}>
                                Change
                              </Text>
                            </TouchableOpacity>
                          </View>
                          
                          <Text></Text>
                          <Text></Text>
                          <View style={styles.separator} />
                          <Text></Text>
                          <Text></Text>
                          

                          <TouchableOpacity style={[styles.materialButtonLong]} onPress={() => Linking.openURL('mailto:libo@stanford.edu,n.dunkel@gmail.com')} >
                            <Text style={[styles.materialButtonTextLong]}>
                              Send Feedback
                            </Text>
                          </TouchableOpacity> 

                          <Text></Text>
                          <Text></Text>
                          <View style={styles.separator} />
                          <Text></Text>
                          <Text></Text>

                          <TouchableOpacity 
                              style={[styles.materialButtonLong, {position: 'absolute', bottom: 40}]}
                              onPress={this._signOutAsync} >
                            <Text style={styles.materialButtonTextLong}>
                              Logout
                            </Text>
                          </TouchableOpacity> 
                      </View>  
                            
                </View> 
                

              
            </ImageBackground>

        
          );
        }
        

    }

const mapStateToProps = (state) => {
    return {
        items: state.items,
        user: state.user,
        token: state.token,
        loggedIn: state.loggedIn,
        firstrun: state.firstrun
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        alterUsergroup: (phone, usergroup) => dispatch(alterUsergroup(phone, usergroup))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);