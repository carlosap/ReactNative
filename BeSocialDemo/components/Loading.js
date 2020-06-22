import React from 'react';
import { View, Platform } from 'react-native';
import { Video } from 'expo-av';
import { Spinner, H6 } from 'nachos-ui'
import { Colors } from "./../styles";

const Loading = (props) => {
    let { title, enableVideo, alignitems, justifycontent, onPlaybackStatusChange } = props;
    return (
        <View style={{
            flex: 1,
            justifyContent: justifycontent ? justifycontent : 'center',
            backgroundColor: Colors.black
        }}>
            {enableVideo ?
                <Video
                    source={require('./..//assets/video1.mp4')}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="contain"
                    shouldPlay
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        overflow: "hidden",
                        borderWidth: (Platform.OS === 'ios') ? 0  : 2,
                        borderColor: Colors.black
                    }}
                    onPlaybackStatusUpdate={(playbackStatus) => onPlaybackStatusChange(playbackStatus)}
                /> : null}
            <View style={{
                alignItems: alignitems ? alignItems : 'center',
                backgroundColor: Colors.black
            }}>
                <Spinner color={Colors.primaryColor} />
                {title ?
                    <H6 align='center' style={{ margin: 15, color: Colors.primaryColor }}>
                        {title}
                    </H6> : null
                }
            </View>
        </View>
    )
}

export default Loading