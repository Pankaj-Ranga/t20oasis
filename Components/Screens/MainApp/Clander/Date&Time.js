import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, ActivityIndicator, Text, Image, Modal, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import { PodContext } from '../../../Constant/Context/PodContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../../Constant/Api';
import CalendarPicker from 'react-native-calendar-picker';


const DateTime = () => {
    const Value = useContext(PodContext);
    const [loader, setLoader] = useState(true);
    const [modalVisible, setModalVisible] = useState(false)
    const [dateModal, setDateModal] = useState(false)
    const [userData, setUserData] = useState({})
    const [userImage, setUserImage] = useState('');
    const [sellectedDate, setSellectedDate] = useState(null);
    const [sellectedPod, setSellectedPod] = useState({ isPodCreator: false, podId: 0, podName: "" })
    const [userAllPods, setUserAllPods] = useState([])


    const GetData = async () => {

        const userData = await AsyncStorage.getItem('UserData')
        setUserData(JSON.parse(userData))
        let UserImage = await AsyncStorage.getItem('UserImage')

        setUserImage(UserImage)
        const date = new Date()
        console.log('dttttttttttttttttttttttttttttttttttt')
        // console.log(date.toLocaleDateString(),'dttttttttttttttttttttttttttttttttttt')
        setSellectedDate(date.toLocaleDateString())
        try {
            const res = await API().getUserAllPods()
            // console.log('kkkkkkllllllllllllllllssssssssssss')
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
    const onDateChange = (date) => {
        console.log(date, 'sssssssssssssdddddddddddddddddddd')

        let Date = `${date.month() + 1}/${date.date()}/${date.year()}`
        // let Date=date.date()
        // let year=date.year()
        setSellectedDate(Date)
        setDateModal(false)

    }

    const Item = ({ renderItem }) => {

        console.log(userImage, 'UserImage')
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
        GetData()
    }, []);


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

                <TouchableOpacity style={{ marginTop: "8%", backgroundColor: 'white', width: '60%', alignSelf: 'center', padding: 10, borderRadius: 20, flexDirection: 'row', justifyContent: "space-around", alignItems: 'center', elevation: 4, shadowOpacity: 4 }} onPress={() => setModalVisible(true)} >

                    <Text style={{ fontSize: 18 }}>{Value.PodValue.podName}</Text>
                    <AntDesign name="down" size={20} />



                </TouchableOpacity>


                <ScrollView style={{ marginBottom:73 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: '5%' }}>
                        <View style={{ width: "40%" }}>
                            <Text style={{ fontSize: 20, color: 'black' }} >Date</Text>
                            <TouchableOpacity style={{ backgroundColor: '#3A0CA3', padding: 10, borderRadius: 80, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => setDateModal(true)}>
                                <Feather name="calendar" color='white' size={18} />
                                <Text style={{ color: 'white' }}>{sellectedDate}</Text>
                                <Feather name="chevron-down" color='white' size={18} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "40%" }}>
                            <Text style={{ fontSize: 20, color: 'black' }} >Time</Text>
                            <TouchableOpacity style={{ backgroundColor: '#3A0CA3', padding: 10, borderRadius: 80, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Feather name="clock" color='white' size={18} />
                                <Text style={{ color: 'white' }}>12:00am</Text>
                                <Feather name="chevron-down" color='white' size={18} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* ######### Card 1 ########## */}

                    <View style={{ height: 150, width: "90%", backgroundColor: 'white', borderRadius: 20, elevation: 1, alignSelf: 'center', marginTop: '5%', shadowOpacity: 2, padding: 10, flexDirection: 'row' }}>
                        <Image style={{ height: 120, width: 80,borderRadius:10 }} source={require('../../../Images/Re1.png')} />

                        <View style={{ width: "50%", padding: 10 }}>
                            <Text style={{ fontSize: 20, color: 'black' }} >La Casa Events</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Feather name="calendar" color='gray' size={16} />
                                <Text style={{ color: 'gray', marginLeft: 5 }}>01,Dec</Text>

                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Feather name="clock" color='gray' size={16} />
                                <Text style={{ color: 'gray', marginLeft: 5 }}>12:00am</Text>

                            </View>

                        </View>
                        <View style={{ alignSelf: 'flex-end' }}>
                            <TouchableOpacity style={{ backgroundColor: '#3A0CA3', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 80, flexDirection: 'row', marginLeft: 5 }}>

                                <Text style={{ color: 'white' }}>Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ######### Card 2 ########## */}

                    <View style={{ height: 150, width: "90%", backgroundColor: 'white', borderRadius: 20, elevation: 1, alignSelf: 'center', marginTop: '5%', shadowOpacity: 2, padding: 10, flexDirection: 'row' }}>
                        <Image style={{ height: 120, width: 80,borderRadius:10 }} source={require('../../../Images/Re2.png')} />

                        <View style={{ width: "50%", padding: 10 }}>
                            <Text style={{ fontSize: 20, color: 'black' }} >La Casa Events</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Feather name="calendar" color='gray' size={16} />
                                <Text style={{ color: 'gray', marginLeft: 5 }}>01,Dec</Text>

                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Feather name="clock" color='gray' size={16} />
                                <Text style={{ color: 'gray', marginLeft: 5 }}>12:00am</Text>

                            </View>

                        </View>
                        <View style={{ alignSelf: 'flex-end' }}>
                        <Text style={{fontSize:20,marginLeft:20,marginBottom:20, color: 'black' }}>250</Text>
                            <TouchableOpacity style={{ backgroundColor: '#3A0CA3', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 80, flexDirection: 'row', marginLeft: 5 }}>

                                <Text style={{ color: 'white' }}>Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                         {/* ######### Card 3 ########## */}

                         <View style={{ height: 150, width: "90%", backgroundColor: 'white', borderRadius: 20, elevation: 1, alignSelf: 'center', marginTop: '5%', shadowOpacity: 2, padding: 10, flexDirection: 'row' }}>
                        <Image style={{ height: 120, width: 80,borderRadius:10 }} source={require('../../../Images/Re4.png')} />

                        <View style={{ width: "50%", padding: 10 }}>
                            <Text style={{ fontSize: 20, color: 'black' }} >La Casa Events</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Feather name="calendar" color='gray' size={16} />
                                <Text style={{ color: 'gray', marginLeft: 5 }}>01,Dec</Text>

                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Feather name="clock" color='gray' size={16} />
                                <Text style={{ color: 'gray', marginLeft: 5 }}>12:00am</Text>

                            </View>

                        </View>
                        <View style={{ alignSelf: 'flex-end' }}>
                            <TouchableOpacity style={{ backgroundColor: '#3A0CA3', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 80, flexDirection: 'row', marginLeft: 5 }}>

                                <Text style={{ color: 'white' }}>Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                      {/* ######### Card 4 ########## */}

                      <View style={{ height: 150, width: "90%", backgroundColor: 'white', borderRadius: 20, elevation: 1, alignSelf: 'center', marginTop: '5%', shadowOpacity: 2, padding: 10, flexDirection: 'row' }}>
                        <Image style={{ height: 120, width: 80 ,borderRadius:10}} source={require('../../../Images/Re3.png')} />

                        <View style={{ width: "50%", padding: 10 }}>
                            <Text style={{ fontSize: 20, color: 'black' }} >La Casa Events</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Feather name="calendar" color='gray' size={16} />
                                <Text style={{ color: 'gray', marginLeft: 5 }}>01,Dec</Text>

                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Feather name="clock" color='gray' size={16} />
                                <Text style={{ color: 'gray', marginLeft: 5 }}>12:00am</Text>

                            </View>

                        </View>
                        <View style={{ alignSelf: 'flex-end' }}>
                            <TouchableOpacity style={{ backgroundColor: '#3A0CA3', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 80, flexDirection: 'row', marginLeft: 5 }}>

                                <Text style={{ color: 'white' }}>Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                {/* #######################
                ####### User All Pod ######
                ####################### */}
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
                {/* #######################
                ####### Dates Modal #######
                ####################### */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={dateModal}
                    onRequestClose={() => {

                        setDateModal(!dateModal);
                    }}
                >
                    <View style={{ backgroundColor: 'rgba(135, 136, 137,0.5)', height: '100%' }}>
                        <View style={{ backgroundColor: "white", paddingBottom: '5%', borderBottomLeftRadius: 30, borderBottomEndRadius: 30, marginTop: '42%' }}>

                            <CalendarPicker
                                onDateChange={onDateChange}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

export default DateTime;
