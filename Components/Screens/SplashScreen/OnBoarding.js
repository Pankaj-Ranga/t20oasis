import React, { useRef, useEffect, useState } from 'react'
import { View, Text, Image } from 'react-native'
import OnboardingSc from 'react-native-onboarding-swiper';
const OnBoarding = () => {

    let boarding = useRef(null);
    const [index, setIndex] = useState(0)
   
    const SetChange = () => {
        boarding.current.goNext()

    }

    useEffect(() => {

        // setTimeout(() => {
        //     let interval = setInterval(() => {
        //         if (index <= 2) {

        //             SetChange()
        //         }
        //     }, 2000);

        //     setInterval(() => {
        //         clearInterval(interval)

        //     }, 6000);
        // }, 1000);

    }, [])
    return (

        <OnboardingSc ref={boarding} pageIndexCallback={(e) => setIndex(e)}

            showSkip={false}
            showNext={false}
            showDone={false}
            bottomBarColor={'white'}
            bottomBarHeight={20}

            imageContainerStyles={{ marginTop: -180 }}
            titleStyles={{ marginTop: -250, fontSize: 20 }}

            pages={[
                {

                    backgroundColor: '#fff',
                    image: (
                        <Image
                            source={require('../../Images/FirstSplash.jpg')}
                            style={{ height: '50%', width: '60%' }}
                            resizeMode="stretch"
                        />
                    ),

                    title: 'We are stronger together. Be one tap away from your community',
                },
                {
                    backgroundColor: '#fff',
                    image: (
                        <Image

                            source={require('../../Images/FirstSplash2.jpg')}

                            style={{ height: '50%', width: '60%' }}
                            resizeMode="stretch"
                        />
                    ),

                    title: `Create and join Pods with your closest network to watch each others' backs`,
                },
                {
                    backgroundColor: '#fff',
                    image: (
                        <Image
                            source={require('../../Images/FirstSplash3.jpg')}
                            style={{ height: '50%', width: '60%' }}
                            resizeMode="stretch"
                        />
                    ),

                    title: 'Be in control. Share your location and send and receive alerts when you need support',
                },
            ]}
        />
    )
}

export default OnBoarding
