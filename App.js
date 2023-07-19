import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons'

import {AuthContext} from './src/components/context';
import SettingsScreen from './src/screens/Settings';
import Login from './src/screens/Login';
import Welcome from './src/screens/Welcome';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {GoogleSignin, statusCodes} from "@react-native-google-signin/google-signin";
import SessionScreen from "./src/screens/Session";
import FeedScreen from "./src/screens/FeedScreen";
import {TouchableOpacity} from "react-native";
import NewPostScreen from "./src/screens/NewPostScreen";
import {useEffect} from "react";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
GoogleSignin.configure();

function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <Stack.Screen name="Home" component={FeedScreen} options={({navigation, route}) => ({
                headerRight: () => (
                    <TouchableOpacity style={{
                        marginRight: 12,
                    }} onPress={()=>{navigation.push('NewPostScreen')}}><Ionicons name={'add'} size={30} color={"#ffffff"}/>
                    </TouchableOpacity>
                ),
            })}/>
            <Stack.Screen name="NewPostScreen" component={NewPostScreen}/>
        </Stack.Navigator>
    );
}

function SettingsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Settings" component={SettingsScreen}/>
        </Stack.Navigator>
    );
}

function SessionStack() {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: '#b6573a',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}>
            <Stack.Screen name="Session" component={SessionScreen}/>
        </Stack.Navigator>
    );
}

function LoginStackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Welcome" component={Welcome}/>
            <Stack.Screen name="Login" component={Login}/>
        </Stack.Navigator>
    );
}

function AfterLogin() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#00d2d3',
                inactiveTintColor: 'gray',
            }}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home-outline' : 'home';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'hammer-outline' : 'hammer';
                    } else if (route.name === 'Session') {
                        iconName = focused ? 'camera-outline' : 'camera';
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color}/>;
                },
            })}>
            <Tab.Screen name="Home" component={HomeStack}/>
            <Tab.Screen name="Session" component={SessionStack}/>
            <Tab.Screen name="Settings" component={SettingsStack}/>
        </Tab.Navigator>
    );
}

function App() {
    const [userInfo, setUserInfo] = React.useState(null);

    const getCurrentUserInfo = async () => {
        try {
            const userInfo = await GoogleSignin.signInSilently();
            setUserInfo(userInfo);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                setUserInfo(null);
            } else {
                setUserInfo(null);
            }
        }
    };

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            setUserInfo(null); // Remember to remove the user from your app's state as well
        } catch (error) {
            console.error(error);
        }
    };

    const onGoogleButtonPress = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setUserInfo(userInfo);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                setUserInfo(null);
            } else if (error.code === statusCodes.IN_PROGRESS) {
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                setUserInfo(null);
            } else {
                setUserInfo(null);
            }
        }
    };

    const authContext = React.useMemo(() => ({
        signIn: async () => {
            await onGoogleButtonPress()
        },
        signOut: async () => {
            await signOut();
        },
        getCurrentUserInfo: async () => {
            await getCurrentUserInfo();
        },
        userInfo: userInfo
    }));

    useEffect( ()=> {
        getCurrentUserInfo();
    }, []);

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                {!userInfo ? <LoginStackNavigator/> : <AfterLogin/>}
            </NavigationContainer>
        </AuthContext.Provider>
    );
}

export default App;
