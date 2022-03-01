import React, { useState, useContext, useEffect } from 'react'
import { View, FlatList, ActivityIndicator,Text,Switch, Modal, TouchableOpacity, StatusBar, Image, ScrollView,PermissionsAndroid } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import { NavigationContainer } from '@react-navigation/native'
import { PodContext } from '../../../Constant/Context/PodContext'
import API from '../../../Constant/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Settings = ({ navigation }) => {
  const Value = useContext(PodContext);
  // console.log(Value,';;;;;;;;;;;;;;;;;;;;;;;;')
  const [modalVisible, setModalVisible] = useState(false)
  const [userData, setUserData] = useState({})
  const [userImage, setUserImage] = useState('');
  const [userAllPods, setUserAllPods] = useState([])
  const [sellectedPod, setSellectedPod] = useState({ isPodCreator: false, podId: 0, podName: "" })
  const [loader, setLoader] = useState(true);

  const [isLocationSharing, setIsLocationSharing] = useState(false);

  const GetData = async () => {
    // console.log('kkkkkk')
    setIsLocationSharing(false)
    const userData = await AsyncStorage.getItem('UserData')
    setUserData(JSON.parse(userData))
    let UserImage = await AsyncStorage.getItem('UserImage')

    // console.log('sssssssssssssssssssssssssssssssssssssssssssssssss>>>>>>>')
    // console.log(UserImage,'sssssssssssssssssssssssssssssssssssssssssssssssss>>>>>>>')
    setUserImage(UserImage)

    try {
      const res = await API().getUserAllPods()
      setUserAllPods(res.response)
      setLoader(false)
    }
    catch (err) {
      console.log(err, 'errgetUserAllPods')
    }
  }

  const SellectPod = async (data) => {
    setSellectedPod(data)
    setModalVisible(false)
    Value.setPodValue(data)

  }
  const toggleSwitchLocationSharing =async () => {

    setIsLocationSharing(previousState => !previousState)
  const tr=await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
          'title': 'Contacts',
          'message': 'This app would like to view your contacts.',
          'buttonPositive': 'Please accept bare mortal'
      }
  )
    console.log(tr ,'sssskkkkkkkkkkkkkkkkkkkkkkkkkkk')

  if(!isLocationSharing && tr=='granted'){
    navigation.navigate('VicinitySharing')
  }else(setIsLocationSharing(previousState => !previousState))
  }
  const Item = ({ renderItem }) => {

    console.log(userImage,'UserImage')
//     let UserImage = await AsyncStorage.getItem('UserImage')
// console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkk')
// console.log(userImage,'llllllllllllllll')
    // setUserImage(UserImage)

    return (

      <TouchableOpacity style={{ flexDirection: 'row', paddingTop: '2%', paddingBottom: '2%', justifyContent: "space-around", alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgb(209, 209, 209)' }} onPress={() => SellectPod(renderItem)} >

{renderItem.isPodCreator ?
  <Image source={{
    uri: `data:image/gif;base64,${userImage}`,
  }} style={{ height: 53, width: 55, borderRadius: 100, marginLeft: 1 }} />
:
        <Image source={require('../../../Images/Location1.png')} style={{ height: 55, width: 50 }} />
}
        <View
          style={{

            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            width: '65%',

          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 20,

              width: '75%',
              alignItems: 'center',
            }}>
            {renderItem.podName}
          </Text>

          {renderItem.isPodCreator ?
            <>
              {renderItem.podName === sellectedPod.podName ?

                <Feather name='check-circle' color="green" size={18} style={{ marginRight: '5%' }} />
                :
                <></>
              }





            </>
            :
            <>
              {renderItem.podName === sellectedPod.podName ?

                <Feather name='check-circle' color="green" size={18} style={{ marginRight: '5%' }} />
                :
                <></>
              }

            </>
          }

        </View>


      </TouchableOpacity>
    );
  }
  const renderItem = ({ item }) => {

    return (
      <Item renderItem={item} />
    );
  }


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      GetData();
    });
    return unsubscribe;
  }, [])

  if (loader) {
    return (
      <View style={{ height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  } else {

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
    
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <TouchableOpacity style={{ marginTop: "8%", backgroundColor: 'white', width: '60%', alignSelf: 'center', padding: 10, borderRadius: 20, flexDirection: 'row', justifyContent: "space-around", alignItems: 'center', elevation: 4, shadowOpacity: 4 }} onPress={() => setModalVisible(true)} >

        <Text style={{ fontSize: 18 }}>{Value.PodValue.podName}</Text>
        <AntDesign name="down" size={20} />



      </TouchableOpacity>
      <ScrollView >

                            {userImage !== null ?

                                <Image style={{ height: 80, width: 80, alignSelf: 'center', borderRadius: 100, marginTop: '10%' }} source={{
                                    uri: `data:image/gif;base64,${userImage}`,
                                }} />


                                :
                                <View style={{ height: 80, borderWidth: 1, borderRadius: 100, borderColor: 'gray', width: 80, alignSelf: 'center', marginTop: '10%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Feather name='camera-off' size={25} />
                                </View>
                            }



      <Text style={{ color: "black", fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginTop: '2%' }}> {userData.firstName} {userData.lastName}</Text>


      <View style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%' }}>

        <Text style={{ color: "black", fontSize: 25, fontWeight: 'bold', marginTop: '10%' }}>Settings</Text>
      </View>

      <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center' }}
        onPress={() => navigation.navigate('NotificationMain')}

      >

        <Ionicons name='notifications-outline' size={30} />
        <Text style={{ fontSize: 20, marginLeft: '10%' }}>Notification</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('PodManage')}>

        <Feather name='users' size={30} />
        <Text style={{ fontSize: 20, marginLeft: '10%' }}>Pod Management</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('LocationSharing')}>

        <Ionicons name='md-location-outline' size={30} />
        <Text style={{ fontSize: 20, marginLeft: '10%' }}>Location Sharing</Text>
      </TouchableOpacity>
     
     
      <View style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center' ,justifyContent:'space-between'}} onPress={() => navigation.navigate('LocationSharing')}>

        <AntDesign name='sharealt' size={30} />
        <Text style={{ fontSize: 20,width:'53%' }}>Vicinity Sharing</Text>
        <Switch
                    style={{}}
                    trackColor={{ false: "rgb(224, 224, 234)", true: "rgb(61, 9, 162)" }}
                    thumbColor={isLocationSharing ? "White" : "white"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitchLocationSharing}
                    value={isLocationSharing}
                />
      </View>
      <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('CameraSharing')}>

        <Feather name='camera' size={30} />
        <Text style={{ fontSize: 20, marginLeft: '10%' }}>Camera Sharing</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('MyAccount')}>

        <Feather name='user' size={30} />
        <Text style={{ fontSize: 20, marginLeft: '10%' }}>Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('Privacy')}>

        <Feather name='lock' size={30} />
        <Text style={{ fontSize: 20, marginLeft: '10%' }}>Privacy</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {

          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ backgroundColor: 'rgba(135, 136, 137,0.5)', height: '100%' }}>
          <View style={{ backgroundColor: "white", maxHeight: '40%', paddingBottom: '5%', borderBottomLeftRadius: 30, borderBottomEndRadius: 30 }}>

            <FlatList
              showsVerticalScrollIndicator={false}
              data={userAllPods}
              renderItem={renderItem}
              onEndReachedThreshold={0}
              keyExtractor={item => item.podId}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
    </View>
  )
}
}

export default Settings
