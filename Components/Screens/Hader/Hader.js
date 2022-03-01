import React from 'react'
import { View, Text, SafeAreaView } from 'react-native'

const Hader = ({ children }) => {
    return (
        <View style={{backgroundColor:'red',padding:20,justifyContent:'center'}}>
            <SafeAreaView>{children} </SafeAreaView>
        </View>
    )
}

export default Hader
