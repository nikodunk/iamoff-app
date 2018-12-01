import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, StatusBar, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator, YellowBox } from 'react-native';
import { connect } from 'react-redux';
import { fetchUser, sendPIN } from '../actions/actions';
import styles from './_styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';




class LoginScreen extends React.Component {


      constructor(props) {
        super(props);
        this.state = { loading: false,
                        phoneNo: '',
                        pin: '' };
      }

      componentDidMount() {
        AsyncStorage.getItem('phone').then((res) => this.setState({phoneNo: res}))
        YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
      }


      _signInAsync = async (text) => {
          this.setState({loading: true})
          console.log('this.state.phoneNo:', this.state.phoneNo)
          this.props.sendPIN(text, this.state.phoneNo)
            .then(() => this.props.navigation.navigate('AuthLoading'))
        }
        
        
        


      render() {
          return (
            <View style={styles.loginContainer }>
              <ImageBackground source={require('../../assets/2.jpg')} style={[styles.loginContainer, { flex: 1, width: '100%'}]}>
                <View style={styles.loginBox}>
                  <StatusBar
                     barStyle="dark-content"
                   />
                  <Text></Text>
                  <Text></Text>
                  <Text></Text>
                  <Text style={[styles.title]}>Welcome!</Text>
                  <Text> </Text>

                  <Text style={styles.subtitle}>Please enter your PIN</Text>
                  <Text> </Text>
                  <Animatable.View animation="rubberBand" easing="ease-out">
                    <TextInput
                      underlineColorAndroid="transparent"
                      style={styles.input}
                      placeholder={'Confirmation Code'}
                      autoFocus={true}
                      keyboardType={'numeric'}
                      onChangeText={(text) => { this.setState({pin: text}); text.length === 4 ? this._signInAsync(text) : null }} />
                  </Animatable.View>
                  <Text></Text>
                  <TouchableOpacity 
                            style={styles.materialButtonLong}
                            onPress={(text) => this._signInAsync(this.state.pin)} >
                          <Text style={styles.materialButtonTextLong}>
                            Login &nbsp;
                            <Icon name={"arrow-right"} size={20} color="white" />
                          </Text>
                  </TouchableOpacity> 
                  <Text></Text>
                  <Button
                    title="Back"
                    style={{color: 'lightblue'}}
                    onPress={() => this.props.navigation.goBack()} 
                  />
                  <Text> </Text>
                  <Text> </Text>
                  {this.state.loading ? <ActivityIndicator /> : null}
                </View>
              </ImageBackground>
      </View>
          );
        }
    }

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendPIN: (PIN, phone) => dispatch(sendPIN(PIN, phone))
    };
};



export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);