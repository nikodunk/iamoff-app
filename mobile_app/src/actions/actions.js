import { AsyncStorage } from 'react-native';
import axios from 'axios';


// post to https://healthserve.herokuapp.com/2/auth/9177043031
export function sendPhoneNumber(phone){
    return dispatch => new Promise((resolve, reject) => {
    axios.post('https://healthserve.herokuapp.com/2/auth/'+ phone)
            .then((response) => {
                resolve(response.data)
                })
        })
}



// post to https://healthserve.herokuapp.com/2/login/9177043031/8523
export function sendPIN(PIN, phoneNo) {
    return dispatch => new Promise((resolve, reject) => {        
        console.log('https://healthserve.herokuapp.com/2/login/'+ phoneNo +'/'+ PIN)
        // AsyncStorage.setItem('jwt', 'token' ); resolve() // UNCOMMENT FOR OFFLINE MODE
        axios.post('https://healthserve.herokuapp.com/2/login/'+  phoneNo +'/'+ PIN)
            .then((response) => {
                    if (response.data == false){ console.log('wrong'); resolve()}
                    else { AsyncStorage.setItem('jwt', 'token' ); AsyncStorage.setItem('usergroup', response.data ); }
                })
            .then(() =>  resolve() )         
    })
}


// post to https://healthserve.herokuapp.com/2/register/9177043031/8523/Nicholas Dunkel
export function register(phoneNo, PIN, name, usergroup) {
    return dispatch => new Promise((resolve, reject) => {        
        console.log('https://healthserve.herokuapp.com/2/register/'+ phoneNo +'/'+ PIN +'/'+ name +'/'+ usergroup)
        axios.post('https://healthserve.herokuapp.com/2/register/'+  phoneNo +'/'+ PIN +'/'+ name +'/'+ usergroup)
            .then((response) => {
                    if (response.data.command === 'UPDATE'){ AsyncStorage.setItem('jwt', 'token' ); AsyncStorage.setItem('usergroup', usergroup ); resolve() }
                    else{ console.log('register didnt work with status:' + response.data); resolve()}
                })         
    })
}


// get to https://healthserve.herokuapp.com/2/getdates/9177043031/2019-05-01
export function fetchData(month, usergroup) {
    return dispatch => new Promise((resolve, reject) => {
        console.log('fetchData ran', month, usergroup)
        axios.get('https://healthserve.herokuapp.com/2/getdates/'+ usergroup +'/' + month)
            .then((items) => {
                    dispatch(fetchDataSuccess(items.data)); 
                    console.log(items.data)
                    resolve()
                })
            // .catch((error) => {AsyncStorage.removeItem('jwt'); console.log(error)});
    })
}
export function fetchDataSuccess(items) {
    return {
        type: 'ITEMS_FETCH_DATA_SUCCESS',
        items
    };
}


// post to https://healthserve.herokuapp.com/2/toggledate/9177043031/2019-05-01
export function putData(date, phoneNo) {
    return dispatch => new Promise((resolve, reject) => {
        console.log('putData ran with date: ' + date + ', phoneNo: ' + phoneNo)
        axios.post('https://healthserve.herokuapp.com/2/toggledate/' + phoneNo + '/' + date, { 
            method: 'POST',
            headers: {
                'mode': 'no-cors',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            }
          )
        .then((response) => {console.log(response.data); resolve()})
        .catch((error) => console.log(error));
    });
}



// get to https://healthserve.herokuapp.com/2/firstrun/9177043031
export function fetchFirstrun(phone) {
    return dispatch => new Promise((resolve, reject) => {
        axios.get('https://healthserve.herokuapp.com/2/firstrun/'+ phone )
            .then((items) => {
                    resolve(items.data)
                })
    })
}


// post to https://healthserve.herokuapp.com/2/firstrun/9177043031
export function setFirstrun(phone) {
    return dispatch => new Promise((resolve, reject) => {
        axios.post('https://healthserve.herokuapp.com/2/firstrun/'+ phone + '/toggle' )
            .then((items) => {
                    resolve(items.data)
                })
    })
}




// post to https://healthserve.herokuapp.com/2/alterusergroup/9177043031/stanim2019
export function alterUsergroup(phone, usergroup) {
    return dispatch => new Promise((resolve, reject) => {
        
        axios.post('https://healthserve.herokuapp.com/2/alterusergroup/'+ phone + '/'+ usergroup )
            .then((items) => {
                    resolve(items.data)
                })
    })
}

// post to https://healthserve.herokuapp.com/2/addstatus/:phoneNo/:date/:status
export function addStatus(phone, date, status) {
    return dispatch => new Promise((resolve, reject) => {
        
        axios.post('https://healthserve.herokuapp.com/2/addstatus/'+ phone + '/'+ date + '/'+ status )
            .then((items) => {
                    resolve(items.data)
                })
    })
}


// post to https://healthserve.herokuapp.com/2/addstatus/:phoneNo/:date/:status
export function putToken(phone, token) {
    return dispatch => new Promise((resolve, reject) => {
        
        axios.post('https://healthserve.herokuapp.com/2/puttoken/'+ phone + '/'+ token )
            .then((items) => {
                    resolve(items.data)
                })
    })
}