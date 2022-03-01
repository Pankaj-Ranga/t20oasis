import React, { useEffect,useState } from 'react'
import { View, Text, Share, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native'
import Hader from '../Hader/Hader'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage';

const InvitCode = (Props) => {
  // console.log(Props.route.params,'Props')
  const InviteCode = Props.route.params
  const [loader, setLoader] = useState(true)
  const [userId, setUserid] = useState('')
  const [userImage, setUserImage] = useState(null);
  // console.log(userId,'userIdddddddd')

  const link = `http://kswd.gingerbox.in/inviteCode?code=${InviteCode}&sendBy=${userId}`
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


  const GetData = async () => {
    let UserImage = await AsyncStorage.getItem('UserImage')
    setUserImage(UserImage)
    // console.log(UserImage,'ssss')
    let UserId = await AsyncStorage.getItem('UserId')
  setUserid(UserId)
  setLoader(false)
  }
const Skip=()=>{

  if (userImage == null) {
    Props.navigation.navigate('AddPhoto', userId)
    
  }else{
    Props.navigation.navigate('Notification')

  }

}
  useEffect(() => {
    GetData()
  }, [])

  if(loader){
    return(
<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

      <ActivityIndicator size='large' color="rgb(176, 176, 176)" />
</View>
      )
  }else{
  return (
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={{ flexDirection: 'row', padding: 20 }}>

        <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => Props.navigation.goBack()} />
        <Text style={{ color: 'black', width: "80%", marginLeft: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Share your invite code with people you want in your Pod</Text>

      </View>

      <View style={{ alignItems: 'center', marginTop: '20%' }}>
        <View style={{ width: '80%', padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'space-around', shadowOpacity: 0.6, elevation: 2, shadowColor: 'gray', }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', letterSpacing: 10, color: 'black' }}>{InviteCode}</Text>
          <Text style={{ fontSize: 16, color: 'rgb(255, 186, 177)', marginTop: 15 }}>This code will be active for 2 days</Text>

        </View>
        <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '20%' }} onPress={onShare}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Share invite code</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '30%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '5%' }} onPress={Skip}>
          <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>Skip</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}
}

export default InvitCode
