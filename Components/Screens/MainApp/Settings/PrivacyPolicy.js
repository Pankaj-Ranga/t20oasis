import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity,ActivityIndicator, StatusBar, Image, ScrollView, Modal } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import API from '../../../Constant/Api'



const PrivacyPolicy = ({ navigation }) => {

    const [loader, setLoader] = useState(true)
    const [polacy, setPolacy] = useState('')
    const [visible, setVisible] = useState(5)
    const loadMore = () => {
        setVisible(polacy.length+1)
    }

    const GetData = async () => {
        try {
            const res = await API().getPrivacyPolacy()
            console.log(res, 'resppppppppppppppppppppppppppppppp')
            setPolacy(res.response)
            setLoader(false)
        } catch (err) { console.log(err, 'PrivacyPolacy') }
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
        <View style={{ backgroundColor: 'white', height: '100%' }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={{ flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderColor: 'rgb(227, 227, 227)' }}>

                <AntDesign style={{ marginTop: '1%' }} name='left' size={20} onPress={() => navigation.goBack()} />



                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', marginLeft: '20%' }}>Privacy Polacy</Text>

            </View>


            <ScrollView style={{ paddingHorizontal: "10%", paddingVertical: '5%' }}>
                <View style={{ paddingBottom: "10%" }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>T2Oasis values your privacy and data.</Text>

                    <Text style={{ marginTop: '5%' }}>{polacy.slice(0, visible)}
                        {visible <= polacy.length ? (


                            <Text style={{ fontSize: 12, color: 'rgb(66, 161, 241)' }} onPress={loadMore}>{" "}...Read our policy</Text>

                        ) : (<></>)}
                    </Text>
                </View>


            </ScrollView>





        </View>
    )
}
}

export default PrivacyPolicy
