import AsyncStorage from '@react-native-async-storage/async-storage';
// import {decode as atob, encode as btoa} from 'base-64'
// import btoa from 'btoa'
import Base64 from './Base64';

// const Api = 'http://kswd.gingerbox.in:8082/api'; // SYSTEM ACCESS IP
const Api = 'https://app1.gingerbox.in/api'; // SYSTEM ACCESS IP
const Api2 = 'https://app2.gingerbox.in/api'; // LocationSharing


const PostWithTokenWithOutBody = async ({ url }) => {

  // console.log( 'testtttt');
  let res;
  await AsyncStorage.getItem('token').then(async (e) => {
    let dd = JSON.parse(e)


    // console.log(dd, 'testtttt...........................');

    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // prettier-ignore
        'Accept': 'application/json',
        // prettier-ignore
        'Authorization': `${dd}`,
      },
    });
  });
  return res.json();
};


const PostWithBarearTokenWithOutBody = async ({ url, body }) => {

  // console.log( 'testtttt');
  let res;
  await AsyncStorage.getItem('token').then(async (e) => {

    // console.log(e, 'token');

    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // prettier-ignore
        // prettier-ignore
        'Authorization': `Bearer ${e}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

  });
  // console.log(res.headers, 'lllllllllllllll')
  return res.json();
};

const fetchWithToken = async ({ url }) => {


  let res;
  await AsyncStorage.getItem('token').then(async (e) => {
    let dd = JSON.parse(e)
    console.log(dd, 'check token get');
    res = await fetch(url, {
      method: 'GET',
      headers: {
        // 'Content-Type': 'application/json',

        'Authorization': `${dd}`,
        'Accept': 'application/json',
      },

    });
  });
  return res.json();
};

const DELETEWithToken = async ({ url }) => {


  let res;
  await AsyncStorage.getItem('token').then(async (e) => {
    let dd = JSON.parse(e)
    // console.log(dd, 'token');

    res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // prettier-ignore
        'Accept': 'application/json',
        // prettier-ignore
        'Authorization': `${dd}`,
      },
    });
    // console.log('lllllllllllllll');
    // console.log(res.headers, 'headers');
  });
  return res.json();
};


const fetchWithOutToken = async ({ url }) => {


  let res;

  res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // prettier-ignore
      // prettier-ignore

      'Accept': 'application/json',
    },
  });

  return res.json();
};


const POSTWithToken = async ({ url, body }) => {

  let res;

  await AsyncStorage.getItem('token').then(async (e) => {
    let dd = JSON.parse(e)


    // console.log(dd, 'testtttt...........................');
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // prettier-ignore
        // prettier-ignore
        'Authorization': `${dd}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

  });
  // console.log(res.headers, 'lllllllllllllll')
  return res.json();
};

const ForLocationSharingPOSTWithToken = async ({ url, body }) => {

  let res;

  await AsyncStorage.getItem('UserId').then(async (e) => {
    let dd = await Base64.btoa()


    // console.log(dd, 'ddtesttttt...........................');
    // console.log(e, 'testtttt...........................');
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // prettier-ignore
        // prettier-ignore
        'Authorization': `Basic ${dd}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

  });
  // console.log(res.headers, 'lllllllllllllll')
  return res.json();
};

// 'Authorization': `Bearer ${data.token}`,

const POSTWithOutToken = async ({ url, body }) => {
  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      // 'Authorization': "Basic MTo=",
      // prettier-ignore
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });


  return res.json()
};


const PATCHWithOutToken = async ({ url, body }) => {
  let res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",

      // 'Authorization': "Basic MTo=",
      // prettier-ignore
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });


  return res.json()
};
const PatchWithToken = async ({ url, body }) => {

  let res;

  await AsyncStorage.getItem('token').then(async (e) => {
    let dd = JSON.parse(e)


    // console.log(dd, 'testtttt...........................');
    res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // prettier-ignore
        // prettier-ignore
        'Authorization': `${dd}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

  });
  // console.log(res.headers, 'lllllllllllllll')
  return res.json();
};
const PutWithToken = async ({ url, body }) => {

  let res;

  await AsyncStorage.getItem('token').then(async (e) => {
    let dd = JSON.parse(e)
    res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // prettier-ignore
        // prettier-ignore
        'Authorization': `${dd}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

  });
  // console.log(res.headers, 'lllllllllllllll')
  return res.json();
};

const API = (credentials) => ({
  // #######################################
  // ######## Get Apies With Token #########
  // #######################################
  getPodAllUsers: (PodId) => fetchWithToken({ url: `${Api}/PodUserAssociation/getPodAllUsers?podId=${PodId}` }),
  getUserAllPods: () => fetchWithToken({ url: `${Api}/User/allPods` }),
  getCountryCode: () => fetchWithToken({ url: `${Api}/ReferenceData?referenceDataName=1` }),
  getLocationSharingHistory: (
    userId,
    podId) => fetchWithToken({ url: `${Api2}/LocationSharing/${userId}/${podId}/history` }),
  getCurrentLocationSharingDetail: (
    userId,
  ) => fetchWithToken({ url: `${Api2}/LocationSharing/${userId}/currentLocationSharingDetailByUserId` }),


  // ###########################################
  // ######## Get Apies With Out Token #########
  // ###########################################

  getUserValidations: (userType, paramType, email) => fetchWithOutToken({ url: `${Api}/User/validateUserRegistrationParams?userType=${userType}&paramType=${paramType}&paramValue=${email}` }),


  getPrivacyPolacy: () => fetchWithOutToken({ url: `${Api}/Settings/privacyPolicy` }),
  getUserauthbyEmail: (email) => fetchWithOutToken({ url: `${Api}/User/auth/byEmail/${email}` }),





  // #########################################
  // ######### PATCH With Token Apies ########
  // #########################################

  PushNotification: (
    deviceToken

  ) =>
    PatchWithToken({
      url: `${Api}/User/updateDeviceDetails`,
      body:

        {
          deviceTokenId:deviceToken ,
          isAndroid: true,
          isIOS: false
        }

     


    }),
  UpdateUser: (
    userid,
    legalName,
    firstName,
    email,
    phonCode,
    phonNum,
    userType,

  ) =>
    PatchWithToken({
      url: `${Api}/User`,
      body:

      {
        userID: userid,
        legalName: legalName,
        profileName: firstName,
        email: email,
        phoneNumber: phonNum,
        userType: userType,
        countryMobileCode: phonCode,

      }


    }),
  // #########################################
  // ######### PUT With Token Apies ########
  // #########################################

  updateNotificationSettings: (
    Podname,
        PushNotificationAllowed,
        LocationSharingAllowed

  ) =>
  PutWithToken({
      url: `${Api}/PodUserAssociation/updateNotificationSettings`,
      body:{
     podName:Podname,
        isPushNotificationAllowed: PushNotificationAllowed,
        isLocationSharingAllowed: LocationSharingAllowed
      }


    }),

  // ############################################
  // ######### PATCH Without Token Apies ########
  // ############################################

  getOTPVerifySignUp: (
    phonCode,
    phonNum,
    otp
  ) => PATCHWithOutToken({
    url: `${Api}/MobileOTP/SignUp/verify`,
    body: {
      countryMobileCode: phonCode,
      phoneNumber: phonNum,
      otp: otp

    },
  }),
  getOTPVerifySignIn: (
    phonCode,
    phonNum,
    otp
  ) => PATCHWithOutToken({
    url: `${Api}/MobileOTP/SignIn/verify`,
    body: {
      countryMobileCode: phonCode,
      phoneNumber: phonNum,
      otp: otp

    },
  }),

  // ############################
  // ####### Delete Apies #######
  // ############################
  getDeletePod: (podName) => DELETEWithToken({ url: `${Api}/POD/${podName}` }),
  getDeletePodUserAssociation: (podName) => DELETEWithToken({ url: `${Api}/PodUserAssociation/${podName}` }),
  // #####################################################
  // ######## Post Apies With Token With Out Body ########
  // #####################################################


  PodUserAssociationPodName: (
    PodName
  ) =>
    PostWithTokenWithOutBody({
      url: `${Api}/PodUserAssociation/${PodName}`,

    }),

  // #############################
  // ######## Post Apies  ########
  // #############################


  PodUserAssociation: (
    inviteCod,
    invited
  ) =>
    POSTWithToken({
      url: `${Api}/PodUserAssociation`,
      body: {
        inviteCode: inviteCod,
        invitedBy: invited
      },
    }),


  StopLocationSharing: (
    locationSharingPhaseID,
    podId,
    UserId,
    massege
  ) =>
    POSTWithToken({
      url: `${Api2}/LocationSharing/stopLocationSharing`,
      body: {
        locationSharingPhaseID: locationSharingPhaseID,
        podID: podId,
        userID: UserId,
        message: massege
      },
    }),


  LocationSharing: (
    locationSharingPhaseID,
    podId,
    UserId,
    latitude,
    longitude,
  ) =>
    POSTWithToken({
      url: `${Api2}/LocationSharing`,
      body: {
        locationSharingPhaseID: locationSharingPhaseID,
        podID: podId,
        userID: UserId,
        latitude: latitude,
        longitude: longitude
      },
    }),
  startLocationSharing: (
    podId,
    userId,
    massege
  ) =>
    POSTWithToken({
      url: `${Api2}/LocationSharing/startLocationSharing`,
      body: {
        podID: podId,
        userId: userId,
        message: massege
      },
    }),
  CreatePodeName: (Name) =>
    POSTWithToken({
      url: `${Api}/POD`,
      body: { podName: Name },
    }),

  // #######################################
  // ######## Post Apies With Out Token ########
  // #######################################
  CreateUser: (
    legalName,
    firstName,
    email,
    phonCode,
    phonNum,
    userType,
    data
  ) =>
    POSTWithOutToken({
      url: `${Api}/User`,
      body:

      {
        legalName: legalName,
        profileName: firstName,
        email: email,
        phoneNumber: phonNum,
        userType: userType,
        countryMobileCode: phonCode,
        isAndroid: true,
        isIOS: false,
        data: "string",
        signUpType: "Email"
      }


    }),

  OtpSendSignUp: (
    phonCode,
    phonNum,
  ) =>
    POSTWithOutToken({
      url: `${Api}/MobileOTP/SignUp/send`,
      body: {
        countryMobileCode: phonCode,
        phoneNumber: phonNum
      },
    }),
  OtpSendSignIn: (
    phonCode,
    phonNum,
  ) =>
    POSTWithOutToken({
      url: `${Api}/MobileOTP/SignIn/send`,
      body: {
        countryMobileCode: phonCode,
        phoneNumber: phonNum
      },
    }),

});

export default API;
