import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, PermissionsAndroid, StatusBar, Image, FlatList, Modal, ScrollView, ActivityIndicator, Linking, TextInput } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Contacts from 'react-native-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PodContext } from '../../../Constant/Context/PodContext'

const VicinitySharing = ({ navigation }) => {
    const Value = useContext(PodContext);
    const [callModal, setCallModal] = useState(false);
    const [userDedatils, setUserDedatils] = useState({ "displayName": "", "phoneNumbers": [{ "number": "" }], "thumbnailPath": "", });
    const [userData, setUserData] = useState({})
    const [location, setLocation] = useState({});
    const [contacts, setContacts] = useState([])
    const [massage, setMassage] = useState([])

    const [loader, setLoader] = useState(true)
    // console.log(userData,'uuuuuuuuuuuuuuuuu')
    // console.log(location,'uuulocationuuuuuuuuuuuuuu')

    const openCallModal = (props) => {
        setUserDedatils(props)
        
        setCallModal(true)
    }
    const CallButton = () => {
        // Linking.openURL(`tel:${userDedatils.phoneNumbers[0].number}`) for Calling
        Linking.openURL(`sms:${userDedatils.phoneNumbers[0].number}?body= Can I call you ? My location is https://www.google.com/maps/@${location.latitude},${location.longitude},13.72z, from ${userData.firstName} ${userData.lastName}`)
    }

    const MassageButton = () => {
        Linking.openURL(`sms:${userDedatils.phoneNumbers[0].number}?body= Can I share my location? from ${userData.firstName} ${userData.lastName}`)
    }
    const SendMassege = () => {
        Linking.openURL(`sms:${userDedatils.phoneNumbers[0].number}?body=${massage}. My location is https://www.google.com/maps/@${location.latitude},${location.longitude},13.72z, from ${userData.firstName} ${userData.lastName}`)
    }

    const Getdata = async () => {

        let customContacts = []
        const userData = await AsyncStorage.getItem('UserData')
        setUserData(JSON.parse(userData))
        const userLocation = await AsyncStorage.getItem('location')
        setLocation(JSON.parse(userLocation))
        try {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    'title': 'Contacts',
                    'message': 'This app would like to view your contacts.',
                    'buttonPositive': 'Please accept bare mortal'
                }
            )
                .then(Contacts.getAll()
                    .then((contacts) => {
                        // work with contacts
                        contacts.map((item, i) => {
                            let dd = { displayName: item.displayName, thumbnailPath: item.thumbnailPath, phoneNumbers: item.phoneNumbers, id: i }
                            customContacts.push(dd)
                            // console.log(dd, 'iiiiiiiiiiiiiiiiiiiiiiiiiiiii')
                        })
                        setContacts(customContacts)
                        setLoader(false)
                    })
                    .catch((e) => {
                        console.log(e)
                    }))

        } catch (err) {
            console.log(err, 'ssssssssssssssss');
        }
    }

    useEffect(() => {
        Getdata()
    }, [])

    const Item = ({ RenderItem }) => {


        return (
            <>
                {RenderItem.phoneNumbers.length > 0 ?
                    <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '1%', flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }} onPress={() => openCallModal(RenderItem)}>
                        {RenderItem.thumbnailPath.length > 0 ?
                            <Image source={{
                                uri: `${RenderItem.thumbnailPath}`,
                            }} style={{ alignSelf: 'center', height: 70, width: 70, borderRadius: 100, marginLeft: 1 }} />
                            :
                            <View style={{ borderWidth: 1, borderRadius: 50, borderColor: 'rgb(215, 215, 215)', backgroundColor: 'rgb(215, 215, 215)', justifyContent: 'center', alignItems: 'center', height: 70, width: 70 }}>
                                <Text style={{ fontSize: 25, fontWeight: 'bold', textTransform: 'capitalize' }}>{RenderItem.displayName[0]}</Text>
                            </View>
                        }
                        <View>

                            <Text style={{ fontSize: 20, marginLeft: '10%', color: 'black', fontSize: 23 }}>{RenderItem.displayName}</Text>
                            <View style={{ flexDirection: 'row', marginLeft: '10%', alignItems: 'center', marginTop: 5 }}>

                                <Feather name='phone-call' size={18} color='#3A0CA3' />
                                <Text style={{ fontSize: 20, color: 'gary', fontSize: 16, marginLeft: 10 }}>{RenderItem.phoneNumbers[0].number}</Text>
                            </View>
                        </View>
                        <AntDesign style={{ marginLeft: '10%' }} color='#3A0CA3' name='sharealt' size={30} />
                    </TouchableOpacity>

                    : <></>}
            </>
        )
    }

    const renderItem = ({ item }) => (
        <Item RenderItem={item} />
    );

    if (loader) {
        return (
            <View style={{ height: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        )
    } else {
        return (
            <View>
                <StatusBar barStyle="dark-content" backgroundColor="white" />
                <View style={{ flexDirection: 'row', padding: 20 }}>

                    <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => navigation.goBack()} />

                    <View style={{ backgroundColor: 'white', width: '60%', marginLeft: '13%', padding: 10, borderRadius: 20, flexDirection: 'row', justifyContent: "space-around", alignItems: 'center', elevation: 4, shadowOpacity: 4 }} >

                        <Text style={{ fontSize: 18 }}>{Value.PodValue.podName}</Text>

                    </View>
                </View>
                {/* <FlatList
                    data={contacts}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                /> */}
                <ScrollView style={{ marginBottom: '23%' }}>

                    {contacts.map((item ,i) => {

return (
    <>
        {item.phoneNumbers.length > 0 ?
            <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '1%', flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center' }} onPress={() => openCallModal(item)}>
                {item.thumbnailPath.length > 0 ?
                    <Image source={{
                        uri: `${item.thumbnailPath}`,
                    }} style={{ alignSelf: 'center', height: 70, width: 70, borderRadius: 100, marginLeft: 1 }} />
                    :
                    <View style={{ borderWidth: 1, borderRadius: 50, borderColor: 'rgb(215, 215, 215)', backgroundColor: 'rgb(215, 215, 215)', justifyContent: 'center', alignItems: 'center', height: 70, width: 70 }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', textTransform: 'capitalize' }}>{item.displayName[0]}</Text>
                    </View>
                }
                <View style={{width:'60%'}}>

                    <Text style={{ fontSize: 20, marginLeft: '10%', color: 'black', fontSize: 23 }}>{item.displayName}</Text>
                    <View style={{ flexDirection: 'row', marginLeft: '10%', alignItems: 'center', marginTop: 5 }}>

                        <Feather name='phone-call' size={18} color='#3A0CA3' />
                        <Text style={{ fontSize: 20, color: 'gary', fontSize: 16, marginLeft: 10 }}>{item.phoneNumbers[0].number}</Text>
                    </View>
                </View>
                <AntDesign style={{ marginLeft: '5%' }} color='#3A0CA3' name='sharealt' size={30} />
            </TouchableOpacity>

            : <></>}
    </>
)
                      
                    })}

                </ScrollView>
                {/* #######################
                ###### Call Modal #####
                ####################### */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={callModal}
                    onRequestClose={() => {

                        setCallModal(!callModal);
                    }}
                >
                    <View style={{ backgroundColor: 'rgba(135, 136, 137,0.5)', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ backgroundColor: "white", paddingBottom: '5%', borderRadius: 30, width: '90%' }}>

                            <View style={{ borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)', paddingVertical: '3%', paddingHorizontal: '1%', flexDirection: 'row', alignItems: 'center', width: '90%', alignSelf: 'center', }} >

                                {userDedatils.thumbnailPath.length > 0 ?
                                    <Image source={{
                                        uri: `${userDedatils.thumbnailPath}`,
                                    }} style={{ alignSelf: 'center', height: 70, width: 70, borderRadius: 100, marginLeft: 1 }} />
                                    :
                                    <View style={{ borderWidth: 1, borderRadius: 50, borderColor: 'rgb(215, 215, 215)', backgroundColor: 'rgb(215, 215, 215)', justifyContent: 'center', alignItems: 'center', height: 70, width: 70 }}>
                                        <Text style={{ fontSize: 25, fontWeight: 'bold', textTransform: 'capitalize' }}>{userDedatils.displayName[0]}</Text>
                                    </View>
                                }


                                <View>

                                    <Text style={{ fontSize: 20, marginLeft: '10%', color: 'black', fontSize: 23 }}>{userDedatils.displayName}</Text>
                                    <View style={{ flexDirection: 'row', marginLeft: '10%', alignItems: 'center', marginTop: 5 }}>

                                        <Feather name='phone-call' size={18} color='#3A0CA3' />
                                        <Text style={{ fontSize: 20, color: 'gary', fontSize: 16, marginLeft: 10 }}>{userDedatils.phoneNumbers[0].number}</Text>
                                    </View>
                                </View>

                            </View>

                            <TouchableOpacity style={{ borderRadius: 30, borderWidth: 1, borderColor: '#3A0CA3', width: '80%', alignSelf: 'center', alignItems: 'center', padding: 10, marginTop: '6%' }} onPress={CallButton}>
                                <Text style={{ color: '#3A0CA3', fontSize: 20 }}>Can I call you ?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ borderRadius: 30, borderWidth: 1, borderColor: '#3A0CA3', width: '80%', alignSelf: 'center', alignItems: 'center', padding: 10, marginTop: '3%' }} onPress={MassageButton}>
                                <Text style={{ color: '#3A0CA3', fontSize: 20 }}>Can I Share my location ?</Text>
                            </TouchableOpacity>

                               
                            <View style={{ borderRadius: 10, borderWidth: 1, borderColor: 'rgb(205, 205, 205)', width: '80%', height: 80, alignSelf: 'center', paddingHorizontal: 10, marginTop: '3%' }}>
                                <TextInput
                                    onChangeText={(e) => setMassage(e)} autoFocus={true} style={{ fontSize: 20 }} multiline={true} placeholder='Type massege' />
                            </View>
                            {massage.length==0?
                            <TouchableOpacity style={{ borderRadius: 30,  width: '60%', alignSelf: 'center', backgroundColor: 'rgb(161, 136, 210)', alignItems: 'center', padding: 10, marginTop: '3%' }} >
                                <Text style={{ color: 'white', fontSize: 20 }}>Send message</Text>
                            </TouchableOpacity>
                            : <TouchableOpacity style={{ borderRadius: 30, borderWidth: 1, borderColor: '#3A0CA3', width: '60%', alignSelf: 'center', backgroundColor: '#3A0CA3', alignItems: 'center', padding: 10, marginTop: '3%' }} onPress={SendMassege}>
                            <Text style={{ color: 'white', fontSize: 20 }}>Send message</Text>
                        </TouchableOpacity>}
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
};

export default VicinitySharing;
