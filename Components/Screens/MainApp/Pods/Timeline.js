import React from 'react'
import { View, Text, StatusBar, ScrollView } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
const Timeline = ({navigation}) => {
    return (
        <View style={{ height: '100%', backgroundColor: 'white' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ flexDirection: 'row', padding: 20 }}>

                <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={()=>navigation.goBack()} />
                <View style={{ width: "80%", marginLeft: '5%' }}>

                    <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold', textAlign: 'center' }}>Meg Dereyers Timeine</Text>
                    <Text style={{ marginTop: '5%', color: 'gray', fontSize: 18, textAlign: 'center' }}>Status: Sharing location with the Tenderloin Crew</Text>
                </View>
            </View>
            <ScrollView style={{ paddingHorizontal: '3%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 15, width: 15, borderRadius: 20, backgroundColor: 'rgb(0, 163, 251)' }}></View>
                    <Text style={{ marginLeft: '5%', color: 'black', fontSize: 25, fontWeight: 'bold' }}>Today</Text>
                </View>

                <View style={{ borderLeftWidth: 1, borderColor: 'rgb(255, 163, 151)', marginLeft: '2%' }}>
                    <View style={{ width: '85%', shadowOpacity: 9, marginLeft: '5%', marginTop: '3%', marginBottom: '8%', paddingHorizontal: '5%', paddingVertical: '3%', shadowColor: 'gray', backgroundColor: 'white', elevation: 1, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>6:50pm</Text>
                            <View style={{ height: 12, width: 12, borderRadius: 20, backgroundColor: 'rgb(255, 163, 151)' }}>
                            </View>
                        </View>
                   
                        <Text style={{ marginTop:'3%', color: 'black',  fontWeight: 'bold' }}>Turn on Location Sharing. </Text>
                        <Text style={{ marginTop:'3%' }}>Meeting a guy named John at the wilshire at 7:30 for 2 hours. He's white,brown hair, brown eyes </Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 15, width: 15, borderRadius: 20, backgroundColor: 'rgb(0, 163, 251)' }}></View>
                    <Text style={{ marginLeft: '5%', color: 'black', fontSize: 25, fontWeight: 'bold' }}>September 10,2020</Text>
                </View>

                <View style={{ borderLeftWidth: 1, borderColor: 'rgb(255, 163, 151)', marginLeft: '2%' }}>
                    <View style={{ width: '85%', shadowOpacity: 9, marginLeft: '5%', marginTop: '3%', paddingHorizontal: '5%', paddingVertical: '3%', shadowColor: 'gray', backgroundColor: 'white', elevation: 1, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>8:57pm</Text>
                            <View style={{ height: 12, width: 12, borderRadius: 20, backgroundColor: 'rgb(18, 208, 206)' }}>
                            </View>
                        </View>
                   
                        <Text style={{ marginTop:'3%', color: 'black',  fontWeight: 'bold' }}>All Good. Turned off Location Sharing. </Text>
                        
                    </View>
                </View>

                <View style={{ borderLeftWidth: 1, borderColor: 'rgb(255, 163, 151)', marginLeft: '2%' }}>
                    <View style={{ width: '85%', shadowOpacity: 9, marginLeft: '5%', marginTop: '3%', marginBottom: '8%', paddingHorizontal: '5%', paddingVertical: '3%', shadowColor: 'gray', backgroundColor: 'white', elevation: 1, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>8:57pm</Text>
                            <View style={{ height: 12, width: 12, borderRadius: 20, backgroundColor: 'rgb(255, 163, 151)' }}>
                            </View>
                        </View>
                   
                        <Text style={{ marginTop:'3%', color: 'black',  fontWeight: 'bold' }}>Turned on Location Sharing. </Text>
                        <Text style={{ marginTop:'3%' }}>Someone's following me. </Text>
                    </View>
                </View>


                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 15, width: 15, borderRadius: 20, backgroundColor: 'rgb(0, 163, 251)' }}></View>
                    <Text style={{ marginLeft: '5%', color: 'black', fontSize: 25, fontWeight: 'bold' }}>September 1,2020</Text>
                </View>

                <View style={{ borderLeftWidth: 1, borderColor: 'rgb(255, 163, 151)', marginLeft: '2%' }}>
                    <View style={{ width: '85%', shadowOpacity: 9, marginLeft: '5%', marginTop: '3%', paddingHorizontal: '5%', paddingVertical: '3%', shadowColor: 'gray', backgroundColor: 'white', elevation: 1, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>8:57pm</Text>
                            <View style={{ height: 12, width: 12, borderRadius: 20, backgroundColor: 'rgb(18, 208, 206)' }}>
                            </View>
                        </View>
                   
                        <Text style={{ marginTop:'3%', color: 'black',  fontWeight: 'bold' }}>All Good. Turned off Location Sharing. </Text>
                        
                    </View>
                </View>

                <View style={{ borderLeftWidth: 1, borderColor: 'rgb(255, 163, 151)', marginLeft: '2%' }}>
                    <View style={{ width: '85%', shadowOpacity: 9, marginLeft: '5%', marginTop: '3%', marginBottom: '8%', paddingHorizontal: '5%', paddingVertical: '3%', shadowColor: 'gray', backgroundColor: 'white', elevation: 1, borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>8:57pm</Text>
                            <View style={{ height: 12, width: 12, borderRadius: 20, backgroundColor: 'rgb(255, 163, 151)' }}>
                            </View>
                        </View>
                   
                        <Text style={{ marginTop:'3%', color: 'black',  fontWeight: 'bold' }}>Turned on Location Sharing. </Text>
                        <Text style={{ marginTop:'3%' }}>Someone's following me. </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default Timeline
