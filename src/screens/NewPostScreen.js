import React, {useEffect, useState} from 'react';
import {Button, Image, TextInput, View} from 'react-native';

import Fire from '../../Fire';
import * as ImagePicker from "expo-image-picker";

export default function NewPostScreen({navigation}) {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);


    const takePhoto = async () => {
        await ImagePicker.requestCameraPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const pickImage = async () => {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: false
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <View>
            <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                    multiline
                    style={{flex: 1, paddingHorizontal: 16}}
                    placeholder="Add a neat description..."
                    onChangeText={text => {
                        setText(text)
                    }}
                />
                <Button title={'Send'} onPress={() => {
                    if (text) {
                        Fire.shared.post({text: text.trim(), image: image}).then((res) => {
                            navigation.goBack();
                        }).catch((err) => {
                            alert(err);
                        });
                    } else {
                        alert('Need valid description');
                    }
                }}/>
            </View>
            <Button title="Pick an image from camera roll" onPress={pickImage}/>
            <Button title="Take a photo" onPress={takePhoto}/>
            {image && <Image source={{uri: image}} style={{width: 200, height: 200}}/>}
        </View>
    );
}
