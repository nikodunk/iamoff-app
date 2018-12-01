import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, TextInput, TouchableOpacity, Alert, ImageBackground, ActivityIndicator, Image, YellowBox } from 'react-native';
import { connect } from 'react-redux';
import { sendPhoneNumber } from '../actions/actions';
import styles from './_styles'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';

class AuthScreen extends React.Component {

      constructor(props) {
        super(props);
        this.state = { loading: false };

      }

      componentDidMount() {
        YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
      }


      _onPress = async (phone) => {
        this.setState({loading: true})
        console.log(phone)
        await this.props.sendPhoneNumber(phone).then((res) => {
              console.log(res)
              if (res === phone +' exists') { AsyncStorage.setItem('phone', phone ).then(() => this.props.navigation.navigate('LoginScreen')) }
              else{ AsyncStorage.setItem('phone', phone ).then(() => this.props.navigation.navigate('RegisterScreen')) }
            });
        
      };


      render() {
          return (
            <View style={styles.loginContainer}>
              <ImageBackground source={require('../../assets/1.jpg')} style={[styles.loginContainer, { flex: 1, width: '100%'}]}>
                  {this.state.loading ? 
                    <View style={styles.loginBox}><ActivityIndicator color="black" /></View> : 
                    <View style={styles.loginBox}>
                      <Animatable.View animation="tada" easing="ease-out">
                          <Image style={styles.buttonImage} source={require('../../assets/logo.png')} />
                      </Animatable.View>
                      <Text style={[styles.subtitle, {color: 'white'}]}>Helps you find time to hang with friends.</Text>
                      <Text> </Text>
                      <Text style={styles.label}>A chill 💊 by Libo and Niko</Text>
                      <Text> </Text>
                      <Text> </Text>
                      <TextInput 
                        underlineColorAndroid="transparent"
                        style={styles.input}
                        placeholder={'Phone Number'}
                        autoFocus={true}
                        keyboardType={'numeric'}
                        onChangeText={ (text) => {  text.length === 10 ? this._onPress(text) : null }}
                        />
                      <Text style={styles.label}>Both for Login and Signup</Text>
                      <Text style={styles.title}> </Text>
                    </View>
                }
              </ImageBackground >
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
      sendPhoneNumber: (phone) => dispatch(sendPhoneNumber(phone))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);