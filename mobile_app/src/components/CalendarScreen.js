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
          Modal,
          YellowBox } from 'react-native';
import { connect } from 'react-redux';
import { putData, fetchData, fetchFirstrun, setFirstrun, addStatus, putToken } from '../actions/actions';
import styles from './_styles'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
import Prompt from 'react-native-input-prompt';
import firebase from 'react-native-firebase';


let tracker = new GoogleAnalyticsTracker("UA-120212494-1");
const firstDot = {key:'firstDot', color: '#ff0081', selectedDotColor: 'white'};
const secondDot = {key:'secondDot', color: '#ff0081', selectedDotColor: 'white'};
const thirdDot = {key:'thirdDot', color: '#ff0081'};



class CalendarScreen extends React.Component {
      

      constructor(props) {
        super(props);
        this.state = {
          beginningOfMonth: '',
          selectedDate: '',
          phoneNo: '',
          usergroup: '',
          firstRun: null,
          rotate: false,
          markedDates: {}, // {'2018-04-01': {selected: true, marked: true},'2018-04-05': { selected: false, marked: true},'2018-04-06': { selected: false,marked: true}},
          markedDatesNoSelection: {}, // {'2018-04-01': {selected: false, marked: true},'2018-04-05': { selected: false, marked: true},'2018-04-06': { selected: false,marked: true}},
          //mockData:{ '2018-04-05': [ {name: "Steven Pease", id: 0}, {name: "George Jetson", id: 1} ], '2018-04-06': [{name: "Selma Hayek", id: 2}, {name: "Sarah Mangano", id: 5}], }
          visible: false
        };
        YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
      }

      handleImageRef = ref => this.image = ref;
      
      componentDidMount() {

          AsyncStorage.getItem('usergroup').then((res) => {
              this.setState({usergroup: res});
              var monthString = this.makeTodayString().slice(0, 8) + "01"
              this.props.fetchData(monthString, res)
                    .then(() => this.initializeMarkedDates() )
                    .then(() => this.initialSelectToday())
                  })
          AsyncStorage.getItem('phone').then((res) => {
              this.setState({phoneNo: res}) 
              this.props.fetchFirstrun(res)
                  .then((firstrun) => {this.setState({firstrun: firstrun});} )
                  })
          var beginningOfMonth = this.makeTodayString().substring(0, 8) + "01"
          
          this.setState({beginningOfMonth: beginningOfMonth })
          tracker.trackScreenView("Home");

          firebase.messaging().getToken()
            .then(fcmToken => {
              if (fcmToken) {
                // user has a device token
                console.log('this is my FBCM token '+fcmToken)
                this.props.putToken(this.state.phoneNo, fcmToken)
              } else {
                // user doesn't have a device token yet
              } 
            });

          firebase.messaging().hasPermission()
            .then(enabled => {
              if (enabled) {
                // user has permissions
                console.log(enabled)
              } else {
                // user doesn't have permission
                firebase.messaging().requestPermission()
                  .then(() => {
                    // User has authorised  
                  })
                  .catch(error => {
                    // User has rejected permissions  
                  });
              } 
            });

          // this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
          //         // Process your message as required
          //         console.log('message received' + message)
          //     });

          this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
                  // Process your notification as required
                  // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
              });
          
          this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
              // Process your notification as required
              // console.log('notif received')
          });
         
      }

      

    
      initializeMarkedDates(){
            var markedDates = {}
            for (var property in this.props.items.dates) {
                    markedDates[property] = {selected: false, marked: false}
                    // mark day if friends are in date array it
                    if(this.props.items.dates[property].length == 0){
                      markedDates[property] = { marked : false, dots: []}
                    }
                    if(this.props.items.dates[property].length == 1){
                      markedDates[property] = { marked : true, dots: [firstDot]}
                    }
                    if(this.props.items.dates[property].length == 2){
                      markedDates[property] = { marked : true, dots: [firstDot, secondDot]}
                    }
                    if(this.props.items.dates[property].length > 2){
                      markedDates[property] = { marked : true, dots: [firstDot, secondDot, thirdDot]}
                    }
            }
            this.setState({markedDates: markedDates})
            this.setState({markedDatesNoSelection: markedDates})
      }

      runOnce(){
        this.setState({firstrun: false});
        this.props.setFirstrun(this.state.phoneNo).then((res) => console.log(res))

      }

      makeTodayString(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            if(dd<10) { dd = '0'+dd }; if(mm<10) { mm = '0'+mm } 
            today = yyyy + '-' + mm + '-' + dd;
            return today;
      }

      initialSelectToday(){
            var today = this.makeTodayString()
            let markedDatesNoSelection = JSON.parse(JSON.stringify(this.state.markedDates))
            
            for (var property in this.state.markedDatesNoSelection) {
                    if(today === property) {
                        markedDatesNoSelection[property].selected = !markedDatesNoSelection[property].selected
                        this.setState({selectedDate: property})
                      } 
            }
            this.setState({markedDates: markedDatesNoSelection})
      }

      selectToday(){
            let markedDatesNoSelection = JSON.parse(JSON.stringify(this.state.markedDates))
            
            for (var property in this.state.markedDatesNoSelection) {
                    if(this.state.selectedDate === property) {
                        markedDatesNoSelection[property].selected = !markedDatesNoSelection[property].selected
                        this.setState({selectedDate: property})
                      } 
            }
            this.setState({markedDates: markedDatesNoSelection})
      }

      changeMonth(month){
          var monthRequestString = month.dateString.slice(0, 8) + "01"
          this.props.fetchData(monthRequestString, this.state.usergroup)
              .then(() => {this.initializeMarkedDates()})
      }

      updateDay(day){
        let markedDates = JSON.parse(JSON.stringify(this.state.markedDatesNoSelection))
        markedDates[day.dateString].selected = !markedDates[day.dateString].selected
        this.setState({markedDates: markedDates})
        this.setState({selectedDate: day.dateString})
      }

      async markOff(){
        var monthRequestString = this.state.selectedDate.substring(0, 8) + "01";
        await this.props.putData(this.state.selectedDate, this.state.phoneNo)
         this.props.fetchData(monthRequestString, this.state.usergroup)
                .then(() => this.initializeMarkedDates() )
                .then(() => this.selectToday())
      }

      async setStatus(status){
          var monthRequestString = this.state.selectedDate.substring(0, 8) + "01";
          await this.props.addStatus(this.state.phoneNo, this.state.selectedDate, status)
            this.props.fetchData(monthRequestString, this.state.usergroup)
                .then(() => this.initializeMarkedDates() )
                .then(() => this.selectToday())
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
          let { fadeAnim } = this.state;

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
                                        style={{marginLeft: 15, marginTop: 6, marginRight: 15 }} />
                                  <Text style={styles.calendarText}>Days Off</Text>
                                  <View style={{ position: 'absolute', right: 10}}>
                                    <Text style={styles.calendarTextSubtitle}>Your Group:</Text>
                                    <Text style={styles.calendarTextSubtitle}>{this.state.usergroup}</Text>
                                  </View>
                                </View>

                              </TouchableOpacity>
                            </View>
                            
                            
                            

                          
                            <Calendar
                              markedDates={this.state.markedDates}
                              onDayPress={(day) => {this.updateDay(day) }}
                              onMonthChange={(month) => {this.changeMonth(month)}}
                              markingType={'multi-dot'}
                              minDate={this.state.beginningOfMonth}
                              hideExtraDays={true}
                              theme={{
                                calendarBackground: 'rgba(0,0,0,0)',
                                selectedDayBackgroundColor: '#ff0081',
                                todayTextColor: '#ff0081',
                                textDisabledColor: 'lightgrey',
                                dotColor: '#ff0081',
                                arrowColor: '#ff0081',
                              }}
                            />

                          
                            <View style={{flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: 5}}>
                              <Text >👇🏽 Who's off {this.state.selectedDate} </Text>
                            </View>

                      </View> 
                  
                      

                      <View style={{  flex: 1 }}>
                              {this.props.items.dates && this.props.items.dates[this.state.selectedDate] && this.props.items.dates[this.state.selectedDate][0] ?  
                              
                                <FlatList
                                  data={this.props.items.dates[this.state.selectedDate]}
                                  renderItem={item => this.listItem(item)}
                                  extraData={this.props.items.dates}
                                  keyExtractor={item => item.phone.toString()}
                                /> 
                              
                              : null}
                              { this.state.markedDates[this.state.selectedDate] && this.state.markedDates[this.state.selectedDate]["marked"]  
                              ?  null : 
                                <Animatable.View animation="flipInY" easing="ease-in-out" style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                      <Image style={styles.emoji} source={require('../../assets/emojisad.png')} />
                                      <View>
                                        <Text style={styles.label}>No one's off on the selected day...</Text>
                                        <Text style={styles.label}>...yet.</Text>
                                      </View>
                                </Animatable.View> 
                              }
                      </View> 
                        
                        <Animatable.View 
                            animation="pulse" 
                            iterationCount="infinite" 
                            direction="alternate" 
                            style={styles.commentButtonImageContainer}>
                            <TouchableOpacity
                                 onPress={  () => { this.setState({visible: true}) }}
                                 activeOpacity={.6}>
                                 <Image style={[styles.buttonImage, {maxHeight: 60, maxWidth: 60}]} source={require('../../assets/chatbutton.png')} />
                            </TouchableOpacity>
                        </Animatable.View>

                        
                        <Animatable.View  animation="pulse" 
                                          iterationCount="infinite" 
                                          direction="alternate" 
                                          style={styles.buttonImageContainer}>

                            <TouchableOpacity
                                 onPress={  () => {this.markOff(); this.setState({rotate: !this.state.rotate}); this.image.transitionTo({  transform: this.state.rotate ? [{rotate: '360deg'}] : [{rotate: '-360deg'}] })} }
                                 activeOpacity={.6}>
                                 <Animatable.Image style={styles.buttonImage} ref={this.handleImageRef} source={require('../../assets/button.png')} />
                            </TouchableOpacity>
                        </Animatable.View>
                      
                            
                </View> 
                

                {this.state.firstrun ? 
                  <Modal
                    transparent={true}
                    animationType="fade"
                    visible={this.state.modalVisible}>
                    <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                      <View style={{bottom: 20, position: 'absolute', right: 50}}>
                        <Text style={[styles.subtitle, {color: 'white'}]}>TRY</Text>
                        <Text style={[styles.subtitle, {color: 'white'}]}>MARKING</Text> 
                        <Text style={[styles.subtitle, {color: 'white'}]}>YOURSELF</Text> 
                        <Text style={[styles.subtitle, {color: 'white'}]}>OFF!</Text> 
                        <Text style={[styles.subtitle, {color: 'white'}]}>👉</Text>                    
                      </View>
                      <Animatable.View  animation="pulse" 
                                          iterationCount="infinite" 
                                          direction="alternate" 
                                          style={styles.buttonImageContainer}>
                            <TouchableOpacity
                                 onPress={  () => { this.markOff(); this.setState({rotate: !this.state.rotate}); this.image.transitionTo({  transform: this.state.rotate ? [{rotate: '360deg'}] : [{rotate: '-360deg'}] }); this.runOnce()} }
                                 activeOpacity={.6}>
                                 <Animatable.Image style={styles.buttonImage}  source={require('../../assets/button.png')} />
                            </TouchableOpacity>
                      </Animatable.View>
                    </View>
                  </Modal>
                   : 
                   null
                 }
            

            <Prompt
                visible={this.state.visible}
                title={"My status on day"}
                placeholder="🏂 Snowboarding 🏂. Call me. "
                onCancel={() =>
                    this.setState({
                        visible: !this.state.visible
                    })
                }
                onSubmit={text => {
                    this.setState({
                        visible: !this.state.visible,
                    })
                    this.setStatus(text)
                    }
                }
            />

               
            </ImageBackground>

        
          );
        }
        

      listItem = (item) => {
        return (
        <View style={{flex: 1}}>
          <TouchableOpacity key={item.item.phone}
             onPress={() => Linking.openURL('sms:'+item.item.phone)} >
            <View style={styles.listItem}>
              <Image style={styles.image} source={require('../../assets/thumbnail.png')} />
              <View>
                <Text style={[styles.text, {fontWeight: '700'}]}>
                  {item.item.name}&nbsp;<Text style={[styles.text, {fontWeight: '100', fontSize: 12,}]}>{item.item.phone}</Text>
                </Text>
                <Text style={[styles.text, {fontWeight: '100', color: '#2191fb'}]}>
                  {item.item.status}
                </Text>
              </View>
            </View>
            <View style={styles.separator} />
          </TouchableOpacity>
        </View>
        );
      };

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
        putData: (newItem, phoneNo) => dispatch(putData(newItem, phoneNo)),
        fetchData: (month, usergroup) => dispatch(fetchData(month, usergroup)),
        fetchFirstrun: (phone) => dispatch(fetchFirstrun(phone)),
        setFirstrun: (phone) => dispatch(setFirstrun(phone)),
        addStatus: (phone, date, status) => dispatch(addStatus(phone, date, status)),
        putToken: (phone, token) => dispatch(putToken(phone, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);