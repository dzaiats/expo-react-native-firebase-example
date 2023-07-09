import uuid from 'uuid';

import getUserInfo from './utils/getUserInfo';
import shrinkImageAsync from './utils/shrinkImageAsync';
import uploadPhoto from './utils/uploadPhoto';

const firebaseApp = require('@react-native-firebase/app');
const firebaseAuth = require('@react-native-firebase/auth');
const firebaseFirestore = require('@react-native-firebase/firestore');
// Required for side-effects
require('firebase/firestore');

const collectionName = 'snack-SJucFknGX';

class Fire {
    constructor() {
        firebaseApp.initializeApp({
            apiKey: 'AIzaSyAQan8_IJ6fY6F8E06FMDKVbWlrdI75mvA',
            authDomain: 'expo-example-6de79.firebaseapp.com',
            databaseURL: 'https://expo-example-6de79.firebaseio.com',
            projectId: 'expo-example-6de79',
            storageBucket: 'expo-example-6de79.appspot.com',
            messagingSenderId: '716190466061',
        });
        // Some nonsense...
        firebaseFirestore().settings({ timestampsInSnapshots: true });

        // Listen for auth
        firebaseAuth().onAuthStateChanged(async user => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }
        });
    }

    // Download Data
    getPaged = async ({ size, start }) => {
        let ref = this.collection.orderBy('timestamp', 'desc').limit(size);
        try {
            if (start) {
                ref = ref.startAfter(start);
            }

            const querySnapshot = await ref.get();
            const data = [];
            querySnapshot.forEach(function(doc) {
                if (doc.exists) {
                    const post = doc.data() || {};

                    // Reduce the name
                    const user = post.user || {};

                    const name = user.deviceName;
                    const reduced = {
                        key: doc.id,
                        name: (name || 'Secret Duck').trim(),
                        ...post,
                    };
                    data.push(reduced);
                }
            });

            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            return { data, cursor: lastVisible };
        } catch ({ message }) {
            alert(message);
        }
    };

    // Upload Data
    uploadPhotoAsync = async uri => {
        const path = `${collectionName}/${this.uid}/${uuid.v4()}.jpg`;
        return uploadPhoto(uri, path);
    };

    post = async ({ text, image: localUri }) => {
        try {
            const { uri: reducedImage, width, height } = await shrinkImageAsync(
                localUri,
            );

            const remoteUri = await this.uploadPhotoAsync(reducedImage);
            this.collection.add({
                text,
                uid: this.uid,
                timestamp: this.timestamp,
                imageWidth: width,
                imageHeight: height,
                image: remoteUri,
                user: getUserInfo(),
            });
        } catch ({ message }) {
            alert(message);
        }
    };

    // Helpers
    get collection() {
        return firebaseFirestore().collection(collectionName);
    }

    get uid() {
        return (firebaseAuth().currentUser || {}).uid;
    }
    get timestamp() {
        return Date.now();
    }
}

Fire.shared = new Fire();
export default Fire;
