import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AuthContext} from "../components/context";
import {StatusBar} from 'expo-status-bar';
import GoogleLogo from "../../assets/svg/GoogleLogo";

export default function LoginScreen() {
    const {signIn} = React.useContext(AuthContext);

    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Sign in to iXample App</Text>
                <TouchableOpacity style={styles.googleButton} onPress={() => signIn()}>
                    <GoogleLogo width={50} height={50} color="#4285F4" />
                    <Text style={styles.buttonText}>Sign in with Google</Text>
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
});
