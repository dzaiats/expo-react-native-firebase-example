import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen({ navigation }) {
    const containerPosition = useRef(new Animated.Value(-20)).current;
    const containerOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        animateContainer();
    }, []);

    const animateContainer = () => {
        Animated.parallel([
            Animated.timing(containerPosition, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(containerOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleLoginPress = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Animated.View
                style={[
                    styles.contentContainer,
                    {
                        transform: [{ translateY: containerPosition }],
                        opacity: containerOpacity,
                    },
                ]}
            >
                <Text style={styles.title}>Welcome to Den iXample!</Text>
                <Text style={styles.subtitle}>Get started with Demo features.</Text>
                <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
                    <Text style={styles.buttonText}>Go to Log in</Text>
                </TouchableOpacity>
            </Animated.View>
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
        marginBottom: 10,
        color: '#333333',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        color: '#666666',
    },
    loginButton: {
        backgroundColor: '#FF6347',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
});
