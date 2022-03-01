import React from 'react'
import { View, Text, StatusBar, TouchableOpacity } from 'react-native'

const Tapping = () => {
    return (
        <View style={{ backgroundColor: 'rgb(255, 163, 151)', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ height: 250, width: 250, backgroundColor: 'rgb(255, 182, 172)', borderRadius: 1000, alignItems: 'center', justifyContent: 'center', marginTop: '10%' }}>
                <TouchableOpacity style={{ height: 200, width: 200, backgroundColor: 'white', borderRadius: 1000, alignItems: 'center', justifyContent: 'center' }}>

                    <Text style={{ color: 'rgb(255, 163, 151)', fontSize: 45, fontWeight: 'bold' }}>SOS</Text>

                </TouchableOpacity>


            </View>
            <Text style={{ width: '55%', textAlign: 'center', color: 'white', marginTop: '20%', fontWeight: 'bold' }}>TAPPING THIS WILL SEND AN SOS SIGNAL TO YOUR POD</Text>
        </View>
    )
}

export default Tapping
