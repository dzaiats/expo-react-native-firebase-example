import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AuthContext} from "../components/context";
import {StatusBar} from 'expo-status-bar';
import GoogleLogo from "../../assets/svg/GoogleLogo";

// Now it is only used for profile inf and sign out
export default function SettingsScreen() {
    const {signOut, userInfo } = React.useContext(AuthContext);

    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <Image source={{ uri: userInfo?.user.photo }} style={styles.profilePicture} />
            <Text style={styles.userName}>{`Hi, ${userInfo?.user.givenName}!`}</Text>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Log out from iXample App</Text>
                <TouchableOpacity style={styles.googleButton} onPress={() => signOut()}>
                    <GoogleLogo width={50} height={50} color="#4285F4" />
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    contentContainer: {
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 5,
        elevation: 2,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    googleLogo: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginLeft: 8
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
});
