import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Share,TouchableOpacity, ActivityIndicator, StatusBar, Image, ScrollView, Modal } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PodContext } from '../../../Constant/Context/PodContext'
import API from '../../../Constant/Api';


const PodManage = ({ navigation }) => {
    const [userData, setUserData] = useState({})
    const [UserId, setUserId] = useState('');
    const [userImage, setUserImage] = useState('');
    const Value = useContext(PodContext);

    const [podsAllUser, setPodsAllUser] = useState([])
console.log(Value,'ValueValueValueValue')

    const [modalVisible, setModalVisible] = useState(false);
    const [loader, setLoader] = useState(true);


    const GetData = async () => {

        const userId = await AsyncStorage.getItem('UserId')
        setUserId(userId)
        const userData = await AsyncStorage.getItem('UserData')

        setUserData(JSON.parse(userData))

        let UserImage = await AsyncStorage.getItem('UserImage')

        setUserImage(UserImage)

        const resPodAllUsers = await API().getPodAllUsers(Value.PodValue.podId)
        // console.log(resPodAllUsers, '..resPodAllUsers!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        setPodsAllUser(resPodAllUsers.response.records)

        setLoader(false)
    }

    const link = `http://kswd.gingerbox.in/inviteCode?code=${Value.PodValue.podInviteCode}&sendBy=${UserId}`
    const onShare = async () => {
      try {
        console.log(link);
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
    useEffect(() => {
        GetData()
    }, [])


    if (loader) {
        return (
            <View style={{ height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        )
    } else {
        return (
            <View style={{ backgroundColor: 'white', height: '100%' }}>
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                <View style={{ flexDirection: 'row', padding: 20 }}>

                    <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => navigation.goBack()} />

                    <View style={{ backgroundColor: 'white', width: '60%', marginLeft: '13%', padding: 10, borderRadius: 20, flexDirection: 'row', justifyContent: "space-around", alignItems: 'center', elevation: 4, shadowOpacity: 4 }} >

                        <Text style={{ fontSize: 18 }}>{Value.PodValue.podName}</Text>

                    </View>
                </View>
                <ScrollView style={{ height: "85%" }}>
                    {userImage !== null ?
                        <Image style={{ height: 80, width: 80, alignSelf: 'center', borderRadius: 100, marginTop: '10%' }} source={{
                            uri: `data:image/gif;base64,${userImage}`,
                        }} />
                        : <View style={{ height: 80, borderWidth: 1, borderRadius: 100, borderColor: 'gray', width: 80, alignSelf: 'center', marginTop: '10%',justifyContent:'center',alignItems:'center' }}>
                            <Feather name='camera-off' size={25} />
                        </View>}
                    <Text style={{ color: "black", fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginTop: '2%' }}> {userData.firstName} {userData.lastName}</Text>


                    <View style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%' }}>

                        <Text style={{ color: "black", fontSize: 25, fontWeight: 'bold', marginTop: '10%' }}>Pod Management</Text>
                    </View>

                    <View style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', }}>


                        <Text style={{ fontSize: 18, }}>Name</Text>
                        <Text style={{ fontSize: 18 }}>{Value.PodValue.podName}</Text>
                    </View>

                    {podsAllUser.map((item) => {

                        console.log(item, '...............................')
                        return (

                            <>
                                {item.isPodCreator ?
                                    <View key={item.podMemberId} style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center' }}>

{userImage !== null ?
                                        <Image style={{ height: 40, width: 40, borderRadius: 100 }} source={{
                                            uri: `data:image/gif;base64,${userImage}`,
                                        }} />

                                        :
                                        <View style={{ height: 40, width: 40, borderWidth: 1, borderRadius: 100, borderColor: 'gray', alignSelf: 'center', justifyContent:'center',alignItems:'center' }}>
                            <Feather name='camera-off' size={15} />
                        </View>}
                                        <Text style={{ width: "40%", fontSize: 18, marginLeft: '3%' }}>{item.podMemberName}</Text>
                                        <Text style={{ fontSize: 18, width: "30%", marginLeft: '3%' }}>Admin</Text>

                                        <TouchableOpacity style={{ width: "15%", marginLeft: '3%' }}>
                                            <Text style={{ color: 'red', fontSize: 18 }}>Edit</Text>
                                        </TouchableOpacity>
                                    </View>
                                    : <>
                                        <View key={item.podMemberId} style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '10%', flexDirection: 'row', alignItems: 'center' }}>

                                            <Image source={{
                                                uri: `${item.podMemberImageUrl}`
                                            }} style={{ height: 40, width: 40, borderRadius: 100 }} />
                                            <Text style={{ width: "35%", fontSize: 18, marginLeft: '3%' }}>{item.podMemberName}</Text>
                                            <Text style={{ fontSize: 18, width: "30%", marginLeft: '3%' }}>Standard</Text>

                                            <TouchableOpacity style={{ width: "15%", marginLeft: '3%' }}>
                                                <Text style={{ color: 'red', fontSize: 18 }}>Edit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>

                                }
                            </>
                        )
                    })}



                    <TouchableOpacity style={{ alignSelf: 'center', marginTop: '5%' }} onPress={() => setModalVisible(true)}>

                        <Text style={{ color: 'red', fontSize: 18, borderBottomWidth: 1, borderColor: 'red' }}>Leave Pod</Text>

                    </TouchableOpacity>

                    <TouchableOpacity style={{alignSelf: 'center', backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '10%' }} onPress={onShare}
                    >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                        Invite Member
                    </Text>
                </TouchableOpacity>

                </ScrollView>

                {/*###################
                ######## Modal #######
                ###################*/}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>

                    <View style={{
                        backgroundColor: 'rgba(52, 52, 52, 0.8)', height: '100%'
                    }}>
                        <View
                            style={{
                                backgroundColor: 'rgb(255, 255, 255)',

                                width: '80%',
                                marginTop: '50%',
                                alignSelf: 'center',
                                padding: 20,
                                borderRadius: 10,

                            }}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontSize: 25,
                                    // fontWeight: 'bold'
                                    // alignSelf: 'center',
                                }}>
                                Do you want to leave your pod?
                            </Text>

                            <Text style={{ color: 'grey', marginTop: '10%' }}>
                                All location sharing with this pod will end. Do you want to leave?
                            </Text>

                            <View style={{ flexDirection: 'row', width: '70%', justifyContent: 'space-around', alignSelf: 'center', marginTop: '10%' }}>
                                <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: "rgb(209, 209, 209)" }} onPress={() => setModalVisible(false)}>
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 20, borderRadius: 20, backgroundColor: 'rgb(61, 9, 162)' }}>
                                    <Text style={{ color: 'white' }}>Leave</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Modal>
            </View>
        )
    }
}

export default PodManage
