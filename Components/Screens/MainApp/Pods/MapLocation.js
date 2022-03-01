import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image, Modal, TextInput, Share, LogBox, ScrollView, Alert, FlatList, Dimensions } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Foundation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SwipeablePanel from 'react-native-sheets-bottom'
import MapView, { PROVIDER_GOOGLE, Marker, Callout, AnimatedRegion } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { RNCamera } from 'react-native-camera';
import API from '../../../Constant/Api';
import * as signalR from '@aspnet/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PodContext } from '../../../Constant/Context/PodContext'
import BackgroundTimer from 'react-native-background-timer';


const MapLocation = ({ navigation }) => {
  // let phaseId =  AsyncStorage.getItem('PhaseId')
  // const PhaseId = JSON.parse(phaseId)
  // console.log(PhaseId, 'phaseIsssssssssssssd.....................')
  const Value = useContext(PodContext);


  const [userId, setUserId] = useState('');
  const [userImage, setUserImage] = useState('');


  const CameraRef = useRef()
  const [swipeablePanelActive, setSwipeablePanelActive] = useState(false);
  const [swipeablePanelShow, setSwipeablePanelShow] = useState(0);
  const [allPodUsersModal, setAllPodUsersModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [leaveModalVisible, setLeaveModalVisible] = useState(false)
  const [locationSharingVisi, setLocationSharingVisi] = useState(false)
  const [locationButton, setLocationButton] = useState('Turn On Location Sharing')
  const [userAllPods, setUserAllPods] = useState([])
  const [podsAllUser, setPodsAllUser] = useState([])

  const [load, setLoad] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isLoader, setIsLoader] = useState(true);
  const [location, setLocation] = useState();
  const [secondlocation, setSecondLocation] = useState('Undifind');
  const [latitudeDelta, setLatitudeDelta] = useState(19.81039477573381);
  const [longitudeDelta, setLongitudeDelta] = useState(0.3661319240927696);
  const [PodName, setPodName] = useState('')
  // console.log(location,'.............;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;..')
  const [deletePodName, setDeletePodName] = useState('')
  const [leavePodName, setLeavePodName] = useState('')
  const [sellectedPod, setSellectedPod] = useState({ isPodCreator: false, podId: 0, podName: "" })

  const [createPod, setCreatePod] = useState(0)
  const [podRes, setPodRes] = useState({})
  const [podLoader, setPodLoader] = useState(false)
  const [validation, setValidation] = useState(true);
  const [locationSharingDetailres, setLocationSharingDetailres] = useState(null);
  const [locationSharingBtnLoader, setLocationSharingBtnLoader] = useState(false);
  const [massege, setMassege] = useState('');



  // console.log(location,'location..............................................')


  const PodValid = function (ad) {
    return function (ad) {
      if (ad.length >= 2) {
        return true;
      } else {
        return false;
      }
    };
  };

  const onShare = async () => {

    const link = `http://kswd.gingerbox.in/inviteCode?code=${podRes.inviteCode}&sendBy=${userId}`
    try {

      const result = await Share.share({
        message: link,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          Alert.alert('Shared Succesfully');
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        Alert.alert('Sharing Dimissed');
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const CreatPod = async () => {
    setSwipeablePanelShow(1)
    var pdValid = PodValid('ad');
    var dataPod = pdValid(PodName);
    if (!dataPod) {
      setValidation(dataPod)
    } else {
      try {
        setPodLoader(true)
        const res = await API().CreatePodeName(
          PodName
        )
        if (res.isSuccess === true) {
          const resUserPod = await API().PodUserAssociationPodName(
            PodName
          )
          GetData()
          setCreatePod(1)
          setPodRes(res.response)
          setPodLoader(false)

        } else {
          setCreatePod(0)
          setPodRes({ podName: "Pod Already exists" })
          setPodLoader(false)
        }
      } catch (err) {
        console.log(err, 'ErrCreatePod')
      }
    }
  }
  const DeleteModOpen = (data) => {

    setDeletePodName(data)
    setDeleteModalVisible(true)
  }
  const DeleteModClose = () => {
    setDeleteModalVisible(false)
  }
  const LeaveModOpen = (data) => {

    setLeavePodName(data)
    setLeaveModalVisible(true)
  }
  const LeaveModClose = () => {
    setLeaveModalVisible(false)
  }

  const LeavePod = async () => {


    try {
      // console.log('sssss')
      const res = await API().getDeletePodUserAssociation(leavePodName)

      console.log(res, 'leavePod..................................')

      if (res.isSuccess)
        GetData()
      DeleteModClose()


    } catch (err) {
      console.log(err, 'errleavePod')
    }
  }

  const openPanel = () => {
    setSwipeablePanelShow(1)
    setSwipeablePanelActive(true);
    setModalVisible(false)
  };


  const closePanel = () => {
    setSwipeablePanelShow(0)
    setSwipeablePanelActive(false);
    setCreatePod(0)
    setPodRes('')
    setPodLoader(false)
  };

  const AllPodUsersOpen = () => {
    setAllPodUsersModal(true)
  };
  const AllPodUsersClose = () => {
    setAllPodUsersModal(false)
  };


  let getlocation;





  if (load == false) {
    if (Platform.OS === 'android') {
      getPermissions();

      // console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
    } else {
      console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      getCoords();
    }
  }

  // getlocation = async () => {
  //   let coo = await getCoords();
  //   if (coo.PERMISSION_DENIED == 1) {
  //     getCoords();

  //   } else {

  //     setLocation(coo);
  //     setLoad(true);
  //     AsyncStorage.setItem('location', JSON.stringify(coo))
  //   }

  // setTimeout(() => {

  // }, 3000);
  // };


  const getCoords = () => {

    Geolocation.getCurrentPosition((info) => {
      // console.log(info,'infooooooooooooooooooooooooooooooooooooooo')

      setLocation(info.coords)
      setLoad(true)
      // if (info.coords.PERMISSION_DENIED == 1) {
      //   // resolve(info.coords);
      //   console.log(info.coords,'iffffffffffffffffffrrrrrrrrrrrrrr')
      // // } else {
      //   console.log(info.coords,'elseeeeeeeeeeeeeeeerrrrrrrrrrrrrr')
      // resolve(info.coords);
      // }
    },
      (error) => {
        // console.log(error.message,'errrrrrrrrrrrrrrrr')
        // setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 1000
      },
    );

  };
  function getPermissions() {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    }).then((data) => {

      if (data === 'already-enabled') {
        setInterval(() => {
          getCoords();

          //  console.log('ssssssssssssssssssssssssssssss')
        }, 5000)
        // console.log('iffffffffffffffffffffffffffffffffffffffffffff')
      }
      else {
        // console.log('elseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
        // setInterval(() => {
        // getlocation();
        // }, 5000);
      }
    });
  }
  //
  // }

  const GetData = async () => {

    let UserId = await AsyncStorage.getItem('UserId')
    setUserId(UserId)
    let UserImage = await AsyncStorage.getItem('UserImage')

    setUserImage(UserImage)

    try {

      const res = await API().getUserAllPods()
      setUserAllPods(res.response)
      const resPodAllUsers = await API().getPodAllUsers(res.response[0].podId)
      // console.log(res, 'respod')
      // console.log(resPodAllUsers, 'resPodAllUsers')
      setPodsAllUser(resPodAllUsers.response.records)

      Value.setPodValue(res.response[0])
      setSellectedPod(res.response[0])

      const resLocationSharingDetail = await API().getCurrentLocationSharingDetail(
        UserId
      )

      console.log(resLocationSharingDetail.response, 'resLocationSharingDetailsssssssssss')

      if (resLocationSharingDetail.response == null) {
        setLocationButton('Turn On Location Sharing')
        setLocationSharingDetailres({ podID: 0 })
      } else {
        setLocationButton('Turn Off Location Sharing')
        setLocationSharingDetailres(resLocationSharingDetail.response)
      }
      setIsLoader(false)
      console.log(UserId,'UserId ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');
      let connection = new signalR.HubConnectionBuilder()
      .withUrl(`http://kswd.gingerbox.in:9003/notification?userId=${UserId}`)
      .build();
    // http://kswd.gingerbox.in:9003/notification.html
    // view-source:http://kswd.gingerbox.in:9003/notification.html

    connection.start().then(a => {
      // console.log('Connected rafa;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');
    });

    connection.on('LocationNotification', order => {
      console.log('LocationNotification;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');

      let dd = JSON.parse(order)
      setSecondLocation(dd)



    });

    }


    catch (err) {
      console.log(err, 'errgetUserAllPods')
    }
  }
  const DeletePod = async () => {
    console.log(deletePodName.podId, 'deletePodName')
    console.log(locationSharingDetailres.podID, 'locationSharingDetailres.podID')
    try {

      if (deletePodName.podId == locationSharingDetailres.podID) {
        DeleteModClose()
        alert('first Loacation Saharing Stop')
      }
      else {

        const res = await API().getDeletePod(deletePodName.podName)
        console.log(res, 'resdeletepodddddddddd')



        if (res.isSuccess)
          GetData()
        DeleteModClose()


      }
    } catch (err) {
      console.log(err, 'errDeletePod')
    }
  }
  const SellectPod = async (data) => {

    console.log(sellectedPod,'sellectedPod>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    setSellectedPod(data)
    setModalVisible(false)
    Value.setPodValue(data)
    setLoader(true)
    const resPodAllUsers = await API().getPodAllUsers(data.podId)
    // console.log(data, '..data!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(data,'..data!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

    // let connection = new signalR.HubConnectionBuilder()
    // .withUrl(`http://kswd.gingerbox.in:9003/notification?podId=${data.podId}`)
    // .build();

    // connection.start().then(a => {
    //   console.log('Connected rafa;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');
    // });

    // connection.on('LocationNotification', order => {
    //   console.log('LocationNotification;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');

    //   let dd = JSON.parse(order)
    //   setSecondLocation(dd)



    // });

    setPodsAllUser(resPodAllUsers.response.records)
    setLoader(false)
  }






  const LocationSharing = async () => {
    const UserId = parseInt(userId)
    console.log(sellectedPod.podId,
      typeof (UserId),
      massege,
      location.latitude,
      location.longitude, 'eeeeeeeeeeeeerrrrrrrrrrrrrrrrrrrrrrrr')

    setLocationSharingBtnLoader(true)
    try {

      if (locationButton === 'Turn On Location Sharing') {
        const res = await API().startLocationSharing(
          sellectedPod.podId,
          UserId,
          massege
        )
        console.log(res, 'eeeeeeeeeeeeerr..1111111111111111111111...................')
        if (res.httpStatusCode == 200) {

          // console.log('ifffffffff')
          const statrtLocationRes = await API().LocationSharing(
            res.response.locationSharingPhaseID,
            sellectedPod.podId,
            UserId,
            location.latitude,
            location.longitude,
          )
          GetData()
          setLocationSharingBtnLoader(false)
          // console.log(statrtLocationRes, 'statrtLocationRes.....................')
          setMassege('')
          setLocationSharingVisi(false)
          Alert.alert("Your location sharing is started now")
          setLocationButton('Turn Off Location Sharing')
          AsyncStorage.setItem('PhaseId', JSON.stringify(res.response))

          // let phaseId = await AsyncStorage.getItem('PhaseId')
          // console.log(phaseId, 'phaseId.....................')
          BackgroundTimer.runBackgroundTimer(async () => {

            const Res = await API().LocationSharing(
              res.response.locationSharingPhaseID,
              sellectedPod.podId,
              UserId,
              location.latitude,
              location.longitude,
            )
            console.log(Res, 'intervalintervalintervalintervalintervalinterval')
          },
            5000);

        } else {
          console.log('else')
        }


      } else {
        // let phaseId = await AsyncStorage.getItem('PhaseId')
        // const PhaseId = JSON.parse(phaseId)
        // console.log(locationSharingDetailres.locationSharingPhaseID, 'phaseId.....................')

        BackgroundTimer.stopBackgroundTimer()
        GetData()
        const StopRes = await API().StopLocationSharing(
          locationSharingDetailres.locationSharingPhaseID,
          sellectedPod.podId,
          UserId,
          massege
        )
        console.log(StopRes, 'StopResStopResStopRes')
        setMassege('')
        setLocationSharingVisi(false)
        Alert.alert("Your location sharing is turn off")
        setLocationButton('Turn On Location Sharing')
        setLocationSharingBtnLoader(false)

      }
    }
    catch (err) { console.log(err, "errLocationSharing") }

  }

  // const Item = ({ renderItem }) => {
  //   // console.log(renderItem, 'rrrrrrrrrrrrrrrrrrrrrrrrrr')

  //   return (
  //     <View style={{ width: '100%', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgb(209, 209, 209)' }} >

  //       <TouchableOpacity style={{ width: '80%', flexDirection: 'row', paddingTop: '2%', paddingBottom: '2%', alignItems: 'center', backgroundColor: 'green' }} onPress={() => SellectPod()/* (renderItem) */} >
  //         {renderItem.isPodCreator ?
  //           <>

  //             {renderItem.podId === locationSharingDetailres.podID ?
  //               <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, width: '90%' }}>



  //                 <Image
  //                   source={{ uri: `${renderItem.imageURL}` }}
  //                   style={{ height: 53, width: 55, borderRadius: 100, marginLeft: 1 }} />


  //                 <Text
  //                   style={{
  //                     color: 'black',
  //                     fontSize: 20,

  //                     width: '65%',
  //                     alignItems: 'center', marginLeft: 5
  //                   }}>
  //                   {renderItem.podName}
  //                 </Text>
  //                 <MaterialIcons name='location-pin' color='red' size={25} />
  //               </View>
  //               :
  //               <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, width: '90%' }}>



  //                 <Image
  //                   source={{ uri: `${renderItem.imageURL}` }}
  //                   style={{ height: 53, width: 55, borderRadius: 100, marginLeft: 1 }} />


  //                 <Text
  //                   style={{
  //                     color: 'black',
  //                     fontSize: 20,

  //                     width: '65%',
  //                     alignItems: 'center', marginLeft: 5
  //                   }}>
  //                   {renderItem.podName}
  //                 </Text>
  //                 <MaterialIcons name='location-pin' color='gray' size={25} />

  //               </View>
  //             }
  //           </>

  //           :
  //           <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, width: '90%' }}>
  //             <Image source={{ uri: `${renderItem.imageURL}` }} style={{ height: 55, width: 50, borderRadius: 100 }} />

  //             <Text
  //               style={{
  //                 color: 'black',
  //                 fontSize: 20,

  //                 width: '75%',
  //                 alignItems: 'center', marginLeft: 5
  //               }}>
  //               {renderItem.podName}
  //             </Text>
  //           </View>
  //         }
  //         {renderItem.podName === sellectedPod.podName ?

  //           <Feather name='check-circle' color="green" size={18} style={{}} />
  //           :
  //           <></>}


  //       </TouchableOpacity>

  //       <View
  //         style={{

  //           width: '20%',
  //           flexDirection: 'row',

  //         }}>


  //         {renderItem.isPodCreator ?


  //           <TouchableOpacity style={{ width: '100%', height: '100%', alignItems: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => DeleteModOpen(renderItem.podName)}>

  //             <AntDesign name='delete' size={18} color='red' />

  //           </TouchableOpacity>



  //           :
  //           <TouchableOpacity style={{ width: '100%', height: '100%', alignItems: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

  //             <Ionicons name='power' size={23} color='gray' style={{ marginRight: '5%', paddingVertical: 10 }}
  //               onPress={() => LeaveModOpen(renderItem.podName)}

  //             />
  //           </ TouchableOpacity>
  //         }

  //       </View>
  //     </View>

  //   );
  // }
  // const renderItem = ({ item }) => {

  //   return (
  //     <Item renderItem={item} />
  //   );
  // }




  //

  useEffect(() => {
    // console.log(userId,'Connected rafa;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');
   

    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

    const unsubscribe = navigation.addListener('focus', () => {
      GetData();
    });
    return unsubscribe;
  }, [])

  // console.log(secondlocation,'LocationNotification;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');

  if (!load || isLoader) {
    return (
      <View style={{ height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  } else {


    return (
      <View style={{ height: '100%', justifyContent: 'flex-end' }} >


        <View style={StyleSheet.absoluteFillObject}>
          <View style={{ height: '100%', width: '100%' }}>
            <RNCamera
              ref={CameraRef}
              captureAudio={false}
              style={{ flex: 1 }}
              type={RNCamera.Constants.Type.back}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }} />

            {sellectedPod.isPodCreator ?
              <>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  onRegionChangeComplete={(region) => {
                    // console.log(region,'region.latitudeDelta')
                    setLatitudeDelta(region.latitudeDelta)
                    setLongitudeDelta(region.longitudeDelta)
                  }}
                  // onRegionChange

                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.09500349117469398,
                    longitudeDelta: 0.060890503227710724,
                  }}

                  AnimatedRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta,
                  }}

                >



                  <Marker
                    coordinate={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }}


                  >
                    <Image source={{
                      uri: `${sellectedPod.imageURL}`,
                    }} style={{ height: 33, width: 35, borderRadius: 100, marginLeft: 1 }} />
                    <Callout style={{ width: 140 }}>
                      <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>Meg Dreyers</Text>
                      <Text>Meetin a guy named john at the</Text>
                    </Callout>
                  </Marker>



                </MapView>
              </>
              : <>


                {secondlocation == 'Undifind' ?

                  <>
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      style={styles.map}
                      onRegionChangeComplete={(region) => {
                        // console.log(region,'region.latitudeDelta')
                        setLatitudeDelta(region.latitudeDelta)
                        setLongitudeDelta(region.longitudeDelta)
                      }}
                      // onRegionChange

                      initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.09500349117469398,
                        longitudeDelta: 0.060890503227710724,
                      }}

                      AnimatedRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: latitudeDelta,
                        longitudeDelta: longitudeDelta,
                      }}
                    >
                    </MapView>
                  </>

                  :
                  <>
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      onRegionChangeComplete={(region) => {

                        setLatitudeDelta(region.latitudeDelta)
                        setLongitudeDelta(region.longitudeDelta)
                      }}

                      style={styles.map}

                       initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.09500349117469398,
                        longitudeDelta: 0.060890503227710724,
                      }}
                      AnimatedRegion={{

                        latitude: secondlocation.Latitude,
                        longitude: secondlocation.Longitude,
                        latitudeDelta: latitudeDelta,
                        longitudeDelta: longitudeDelta,
                      }}
                      zoomEnabled={true}
                    >
                      <Marker
                        coordinate={{
                          latitude: secondlocation.Latitude,
                          longitude: secondlocation.Longitude,
                        }}


                      >
                        <Image source={{
                          uri: `${sellectedPod.imageURL}`,
                        }} style={{ height: 33, width: 35, borderRadius: 100, marginLeft: 1 }} />
                        <Callout style={{ width: 140 }}>
                          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>Meg Dreyers</Text>
                          <Text>Meetin a guy named john at the</Text>
                        </Callout>
                      </Marker>
                    </MapView>
                  </>
                }
              </>}
          </View>


          <View style={{ position: 'absolute', width: '100%' }}>

            <TouchableOpacity style={{ marginTop: "10%", backgroundColor: 'white', width: '60%', alignSelf: 'center', padding: 10, borderRadius: 20, flexDirection: 'row', justifyContent: "space-around", alignItems: 'center', elevation: 10, shadowOpacity: 4 }} onPress={() => {
              setModalVisible(true)

            }
            }>

              {sellectedPod.podName.length <= 1 ?
                <Text style={{ fontSize: 18 }}>
                  Pods
                </Text>
                :
                <Text style={{ fontSize: 18 }}>
                  {(sellectedPod.podName)}
                </Text>
              }
              <AntDesign name="down" size={20} />

            </TouchableOpacity>

            {sellectedPod.isPodCreator ?
              <>
                {locationSharingDetailres.podID == 0 || locationSharingDetailres.podID == sellectedPod.podId ? <>
                  <TouchableOpacity style={{ marginTop: '73%', backgroundColor: '#3A0CA3', width: '60%', alignItems: 'center', alignSelf: 'flex-end', padding: 10, borderRadius: 20, }} onPress={() => setLocationSharingVisi(true)}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{locationButton}</Text>

                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginTop: '2%', backgroundColor: '#3A0CA3', width: '60%', alignItems: 'center', alignSelf: 'flex-end', padding: 10, borderRadius: 20, }}
                  // onPress={() => setLocationSharingVisi(true)}
                  >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Turn On Video Sharing</Text>

                  </TouchableOpacity>
                  {/* <TouchableOpacity style={{ marginTop: '2%', backgroundColor: '#3A0CA3', width: '60%', alignItems: 'center', alignSelf: 'flex-end', padding: 10, borderRadius: 20, }}
                  // onPress={() => setLocationSharingVisi(true)}
                  >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Longitude: {location.longitude}</Text>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>latitude: {location.latitude}</Text>

                  </TouchableOpacity> */}
                </>
                  : <>
                    <View style={{ marginTop: '73%', backgroundColor: '#3A0CA3', width: '70%', alignItems: 'center', alignSelf: 'flex-end', padding: 10, borderRadius: 20, }} >
                      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Sharing is active on other Pod</Text>

                    </View>
                  </>}
              </>
              : <></>}

          </View>
        </View>

        {/* ###########################################
        ######### SwipeablePanel Create Pod############ 
        ########################################### */}
        {swipeablePanelShow == 1 ?

          <SwipeablePanel
            // fullWidth
            isActive={swipeablePanelActive}
            onClose={closePanel}
            onPressCloseButton={closePanel}
            barStyle={{ width: 30 }}
            closeOnTouchOutside={true}
            style={{ height: '90%', }}>
            {createPod == 0 ?
              <View
                style={{
                  // alignItems: 'center',

                  backgroundColor: "white",

                  padding: 5,
                  marginTop: 10,
                  // justifyContent: 'center',
                }}>
                <Text style={{ fontSize: 22, alignSelf: 'center', fontWeight: 'bold' }}>New Pod</Text>
                {validation ?
                  <View style={{ borderBottomWidth: 1, width: '85%', alignSelf: 'center', borderColor: 'gray', paddingHorizontal: '3%', marginTop: '10%' }}>
                    <TextInput style={{ color: 'gray', fontSize: 20, height: 40, marginLeft: 5 }}
                      placeholder="Pod Name"
                      placeholderTextColor="gray"
                      onChangeText={(e) => setPodName(e)}
                    />
                  </View>
                  :
                  <View style={{ borderBottomWidth: 1, width: '85%', alignSelf: 'center', borderColor: 'red', paddingHorizontal: '3%', marginTop: '10%' }}>
                    <TextInput style={{ color: 'gray', fontSize: 20, height: 40, marginLeft: 5 }}
                      placeholder="Pod Name"
                      placeholderTextColor="red"
                      onChangeText={(e) => setPodName(e)}
                    />
                  </View>
                }
                {podLoader ? <ActivityIndicator size="large" style={{ marginTop: '3%' }} /> :
                  <Text style={{ alignSelf: 'center', fontSize: 18, color: 'red', marginTop: '3%' }}>
                    {podRes.podName}
                  </Text>
                }

                <TouchableOpacity style={{ marginTop: '20%', backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, width: '90%', alignSelf: 'center' }} onPress={CreatPod}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Create My Pod</Text>
                </TouchableOpacity>
              </View>
              :
              <View
                style={{
                  // alignItems: 'center',

                  backgroundColor: "white",

                  padding: 5,
                  marginTop: 10,
                  // justifyContent: 'center',
                }}>
                <Text style={{ fontSize: 22, alignSelf: 'center', fontWeight: 'bold' }}>SF Fam Pod</Text>
                <Text style={{ width: '70%', marginTop: '10%', fontSize: 25, alignSelf: 'center', fontWeight: 'bold' }}>Invite the peopel you trust most to your Pod and help keep each other's backs safe when you need it  most.</Text>


                <TouchableOpacity style={{ marginTop: '10%', backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, width: '90%', alignSelf: 'center' }} onPress={onShare}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>invite</Text>
                </TouchableOpacity>
              </View>

            }
          </SwipeablePanel>

          : <></>}

        <AntDesign onPress={AllPodUsersOpen} style={{ alignSelf: 'center', backgroundColor: 'white', padding: 10, borderRadius: 100 }} name="up" size={20} color="#3A0CA3" />


        {/* ####################################
        ######### all Pod Users Modal ########## 
        #####################################*/}

        <Modal
          animationType="slide"
          transparent={true}
          visible={allPodUsersModal}

          onRequestClose={() => {

            AllPodUsersClose()

          }}
        >
          <TouchableOpacity style={{ height: '100%', justifyContent: 'flex-end' }} onPressOut={AllPodUsersClose}>

            <AntDesign onPress={AllPodUsersClose} style={{ alignSelf: 'center', backgroundColor: 'white', padding: 10, borderRadius: 100 }} name="down" size={20} color="#3A0CA3" />
            <View
              style={{
                borderTopRightRadius: 40, borderTopLeftRadius: 40,

                backgroundColor: "white",
                // height: '100%',
                maxHeight: '50%', minHeight: '0%',
                padding: 5,
                // marginTop: 10,
                // justifyContent: 'center',
              }}>
              <ScrollView>
                {podsAllUser.map((item) => {
                  // console.log(item, 'itemmmmmmmmmmmmmmmmmmmmmm')

                  return (
                    <>
                      {loader ?
                        <>
                          <ActivityIndicator size="large" />
                        </> : <>

                          {!sellectedPod.isPodCreator ? <>
                            {item.isPodCreator ?


                              <TouchableOpacity style={{
                                flexDirection: 'row', justifyContent: "space-around", alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: 'rgb(209, 209, 209)'
                              }}
                              //  onPress={() => navigation.navigate('Timeline')}
                              >
                                <Image source={{
                                  uri: `${item.podMemberImageUrl}`
                                }} style={{ height: 50, width: 50, borderRadius: 100 }} />
                                <View
                                  style={{


                                    width: '65%',

                                  }}>
                                  <Text
                                    style={{
                                      color: 'black',
                                      fontSize: 20,
                                      fontWeight: 'bold'
                                      // alignSelf: 'center',
                                    }}>
                                    {item.podMemberName}
                                  </Text>


                                </View>

                                <AntDesign name="right" size={20} />
                              </TouchableOpacity>
                              : <>
                              </>
                            }
                          </> : <>

                            <TouchableOpacity style={{
                              flexDirection: 'row', justifyContent: "space-around", alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: 'rgb(209, 209, 209)'
                            }}
                            //  onPress={() => navigation.navigate('Timeline')}
                            >
                              <Image source={{
                                uri: `${item.podMemberImageUrl}`
                              }} style={{ height: 53, width: 55, borderRadius: 100, marginLeft: 1 }} />
                              <View
                                style={{


                                  width: '65%',

                                }}>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontSize: 20,
                                    fontWeight: 'bold'
                                    // alignSelf: 'center',
                                  }}>
                                  {item.podMemberName}
                                </Text>

                              </View>

                              <AntDesign name="right" size={20} />
                            </TouchableOpacity>


                          </>}
                        </>
                      }
                    </>
                  )
                })}
              </ScrollView>


            </View>

          </TouchableOpacity>

        </Modal>


        {/* ####################################
        ######### Users all Pod Modal ########## 
        #####################################*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {

            setModalVisible(!modalVisible)
            setSwipeablePanelShow(0)
          }}
        >
          <View style={{ backgroundColor: 'rgba(135, 136, 137,0.5)', height: '100%' }}>
            <View style={{ backgroundColor: "white", maxHeight: '40%', paddingBottom: '5%', borderBottomLeftRadius: 30, borderBottomEndRadius: 30 }}>

              {/* <FlatList
                showsVerticalScrollIndicator={false}
                data={userAllPods}
                renderItem={renderItem}
                onEndReachedThreshold={0}
                keyExtractor={item => item.podId}
              /> */}
              <ScrollView>
                {userAllPods.map((renderItem) => {
                  return (
                    <View style={{ width: '100%', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgb(209, 209, 209)' }} >

                      <TouchableOpacity style={{ width: '80%', flexDirection: 'row', paddingTop: '2%', paddingBottom: '2%', alignItems: 'center' }} onPress={() => SellectPod(renderItem)}>
                        {renderItem.isPodCreator ?
                          <>

                            {renderItem.podId === locationSharingDetailres.podID ?
                              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, width: '90%' }}>



                                <Image
                                  source={{ uri: `${renderItem.imageURL}` }}
                                  style={{ height: 53, width: 55, borderRadius: 100, marginLeft: 1 }} />


                                <Text
                                  style={{
                                    color: 'black',
                                    fontSize: 20,

                                    width: '65%',
                                    alignItems: 'center', marginLeft: 5
                                  }}>
                                  {renderItem.podName}
                                </Text>
                                <MaterialIcons name='location-pin' color='red' size={25} />
                              </View>
                              :
                              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, width: '90%' }}>



                                <Image
                                  source={{ uri: `${renderItem.imageURL}` }}
                                  style={{ height: 53, width: 55, borderRadius: 100, marginLeft: 1 }} />


                                <Text
                                  style={{
                                    color: 'black',
                                    fontSize: 20,

                                    width: '65%',
                                    alignItems: 'center', marginLeft: 5
                                  }}>
                                  {renderItem.podName}
                                </Text>
                                <MaterialIcons name='location-pin' color='gray' size={25} />

                              </View>
                            }
                          </>

                          :
                          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, width: '90%' }}>
                            <Image source={{ uri: `${renderItem.imageURL}` }} style={{ height: 55, width: 50, borderRadius: 100 }} />

                            <Text
                              style={{
                                color: 'black',
                                fontSize: 20,

                                width: '75%',
                                alignItems: 'center', marginLeft: 5
                              }}>
                              {renderItem.podName}
                            </Text>
                          </View>
                        }
                        {renderItem.podName === sellectedPod.podName ?

                          <Feather name='check-circle' color="green" size={18} style={{}} />
                          :
                          <></>}


                      </TouchableOpacity>

                      <View
                        style={{

                          width: '20%',
                          flexDirection: 'row',

                        }}>


                        {renderItem.isPodCreator ?


                          <TouchableOpacity style={{ width: '100%', height: '100%', alignItems: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => DeleteModOpen(renderItem)}>

                            <AntDesign name='delete' size={18} color='red' />

                          </TouchableOpacity>



                          :
                          <TouchableOpacity style={{ width: '100%', height: '100%', alignItems: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                            <Ionicons name='power' size={23} color='gray' style={{ marginRight: '5%', paddingVertical: 10 }}
                              onPress={() => LeaveModOpen(renderItem.podName)}

                            />
                          </ TouchableOpacity>
                        }

                      </View>
                    </View>
                  )
                })}
              </ScrollView>

              <View style={{ flexDirection: "row", justifyContent: 'space-around', marginTop: '5%' }}>
                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, }}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Invite Member</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, }} onPress={openPanel}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Create a Pod</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </Modal>

        {/* #############################
        #########Delete Modal############ 
        ###############################*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => {

            setModalVisible(!modalVisible);
          }}
        >
          <View style={{ backgroundColor: 'rgba(135, 136, 137,0.5)', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
            <View style={{ backgroundColor: "white", paddingBottom: '5%', borderRadius: 10, width: "80%", padding: '5%' }}>
              <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Are you sure you want to delete {deletePodName.podName} pod</Text>



              <View style={{ flexDirection: "row", justifyContent: 'space-around', marginTop: '10%' }}>
                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, width: '40%' }} onPress={DeleteModClose}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, width: '40%' }} onPress={DeletePod} >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Delete Pod</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </Modal>


        {/* #############################
        #########Leave Modal############ 
        ###############################*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={leaveModalVisible}
          onRequestClose={() => {

            setLeaveModalVisible(false);
          }}
        >
          <View style={{ backgroundColor: 'rgba(135, 136, 137,0.5)', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
            <View style={{ backgroundColor: "white", paddingBottom: '5%', borderRadius: 10, width: "80%", padding: '5%' }}>
              <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Are you sure you want to leave {leavePodName} pod</Text>



              <View style={{ flexDirection: "row", justifyContent: 'space-around', marginTop: '10%' }}>
                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, width: '40%' }} onPress={LeaveModClose}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, width: '40%' }} onPress={LeavePod} >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Leave Pod</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </Modal>

        {/* #############################
        ##### Location Sharing Modal ##### 
        ###############################*/}
        <Modal
          animationType="slide"
          transparent={true}
          visible={locationSharingVisi}
          onRequestClose={() => {

            setLocationSharingVisi(!locationSharingVisi);
          }}
        >
          <View style={{ backgroundColor: 'rgba(135, 136, 137,0.5)', height: '100%', alignItems: 'center' }}>
            <View style={{ backgroundColor: "white", paddingBottom: '5%', borderRadius: 10, width: "80%", marginTop: '20%', padding: '5%' }}>
              {sellectedPod.podName.length <= 0 ?

                <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>First Sellect a pod</Text>
                :
                <>
                  <Text style={{ width: '70%', alignSelf: 'center', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Location sharing with the {sellectedPod.podName}</Text>
                  {massege.length <= 0
                    ?
                    <View style={{ marginTop: '15%', borderWidth: 1, borderRadius: 10, borderColor: 'red', paddingHorizontal: 5, height: 150 }}>

                      <TextInput
                        onChangeText={(e) => setMassege(e)} autoFocus={true} style={{ fontSize: 20 }} multiline={true} />
                    </View>
                    :
                    <View style={{ marginTop: '15%', borderWidth: 1, borderRadius: 10, borderColor: 'red', paddingHorizontal: 5, height: 150 }}>

                      <TextInput
                        onChangeText={(e) => setMassege(e)} autoFocus={true} style={{ fontSize: 20 }} multiline={true} />
                    </View>
                  }
                </>

              }



              <View style={{ flexDirection: "row", justifyContent: 'space-around', marginTop: '10%' }}>
                <TouchableOpacity style={{ backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, width: '40%' }} onPress={() => setLocationSharingVisi(false)}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                {massege.length <= 0 ?
                  <View style={{ backgroundColor: 'rgb(161, 136, 210)', alignItems: 'center', padding: 10, borderRadius: 20, width: '40%' }}  >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{locationButton === 'Turn On Location Sharing' ? 'Turn on' : 'Turn off'}</Text>
                  </View>
                  :
                  <TouchableOpacity style={{ backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, borderRadius: 20, width: '40%' }} onPress={LocationSharing}  >
                    {locationButton === 'Turn On Location Sharing' ?
                      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                        {locationSharingBtnLoader ? <ActivityIndicator color='gray' size="small" /> : 'Turn on'}
                      </Text>
                      :
                      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                        {locationSharingBtnLoader ? <ActivityIndicator color='gray' size="small" /> : 'Turn off'}

                      </Text>
                    }
                    {/* locationSharingBtnLoader */}
                  </TouchableOpacity>
                }

              </View>
            </View>
          </View>
        </Modal>

      </View>

    )
  }
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
export default MapLocation
