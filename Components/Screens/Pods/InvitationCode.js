import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StatusBar,ActivityIndicator } from 'react-native'
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import AntDesign from 'react-native-vector-icons/AntDesign'
import API from '../../Constant/Api';

const InvitationCode = (props) => {
    const senderId = parseInt(props.route.params.id)
    const InviteCode = props.route.params.code
    console.log(typeof(senderId),'senderI')
    const [invieCode, setInvieCode] = useState(InviteCode);
    const [loader, setLoader] = useState(false);
    const [invieCodeStatus, setInvieCodeStatus] = useState('');

    
    const JoinWitInvitationCode = async () => {

        try {
            setLoader(true)
            const res = await API().PodUserAssociation(
                invieCode,
                senderId
            )
            setLoader(false)
            console.log(res, 'resPodUserAssociation')
            if (res.isSuccess) {

                props.navigation.replace('MyTabs')
            } else {
                setInvieCodeStatus("You are already associatd this Pod..")
            }

        } catch (err) { console.log(err, "errPodUserAssociation") }

    }

    return (
        <View style={{ backgroundColor: 'white', height: '100%', alignItems: 'center' }}>

            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ flexDirection: 'row', padding: 20 }}>

                <AntDesign style={{ marginTop: '1%' }} name='left' size={20} />
                <Text style={{ color: 'black', width: "79%", marginLeft: '5%', fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Joining a Pod? Enter your invite code</Text>

            </View>
            <SmoothPinCodeInput
                value={invieCode}
                containerStyle={{ marginTop: '20%' }}
                onTextChange={(code) => setInvieCode(code)}
                cellStyle={{
                    borderWidth: 1,
                    borderRadius: 2,
                    borderColor: 'gray',
                }}
                cellStyleFocused={{
                    borderWidth: 2,
                    borderRadius: 2,
                    borderColor: '#3A0CA3',
                }}
                keyboardType={'email-address'}
                codeLength={6}
                cellSize={40}
                cellSpacing={10}
            />
            {loader ? 
            <ActivityIndicator size='large' color="rgb(176, 176, 176)" />
        :
            <Text style={{ marginTop: '3%', color: 'red' }}>{invieCodeStatus}</Text>
        }
            <TouchableOpacity style={{ backgroundColor: '#3A0CA3', width: '80%', alignItems: 'center', padding: 10, borderRadius: 20, marginTop: '25%' }}
                onPress={JoinWitInvitationCode}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Continue</Text>
            </TouchableOpacity>
        </View>
    )
}

export default InvitationCode
