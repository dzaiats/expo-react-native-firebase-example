import uuid from 'react-native-uuid';
import * as React from 'react';
import uploadPhoto from './src/utils/uploadPhoto';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import app from '@react-native-firebase/app';
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import shrinkImageAsync from "./src/utils/shrinkImageAsync";

const collectionName = 'feed_123';

class Fire {
    constructor() {
        if (!app.apps.length) {
            app.initializeApp({
                apiKey: process.env.FB_API_KEY,
                authDomain: process.env.FB_API_KEY,
                databaseURL: process.env.FB_DB_URL,
                projectId: process.env.FB_PROJECT_ID,
                storageBucket: process.env.FB_STORAGE_BUCKET,
                messagingSenderId: process.env.FB_MSG_SENDER_ID,
            }).then(r => console.info("Firebase init", r)).catch((e) => {
                console.error("Firebase init error", e);
            });

            firestore().settings({timestampsInSnapshots: true}).then((r) => {
                auth().onAuthStateChanged(async user => {
                    if (!user) {
                        await auth().signInAnonymously();
                    }
                });
            });
        }
    }

    // Download feed from Firestore
    getPaged = async ({size, start}) => {
        let ref = this.collection.orderBy('timestamp', 'desc').limit(size);
        try {
            if (start) {
                ref = ref.startAfter(start);
            }

            const querySnapshot = await ref.get();
            const data = [];
            querySnapshot.forEach(function (doc) {
                if (doc.exists) {
                    const post = doc.data() || {};
                    const user = post.user || {};
                    const reduced = {
                        key: doc.id,
                        name: user.name,
                        ...post,
                    };
                    data.push(reduced);
                }
            });

            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            return {data, cursor: lastVisible};
        } catch ({message}) {
            alert(message);
        }
    };

    // Upload Photo to Firebase storage
    uploadPhotoAsync = async uri => {
        const path = `${collectionName}/${this.uid}/${uuid.v4()}.jpg`;
        console.info("Debug point here 0", path);
        return uploadPhoto(uri, path);
    };

    post = async ({text, image: localUri = null}) => {
        try {
            let remoteUri = null;
            if (localUri) {
                const {uri: reducedImage, width, height} = await shrinkImageAsync(
                    localUri,
                );
                remoteUri = await this.uploadPhotoAsync(localUri);
            }

            const userInfo = await GoogleSignin.signInSilently();
            this.collection.add({
                text,
                uid: userInfo.user.id,
                timestamp: this.timestamp,
                image: remoteUri,
                user: userInfo.user,
            }).then((res) => {
                console.info("Added post", res);
            }).catch((err) => console.error("Cannot add post", err));

        } catch ({message}) {
            alert(message);
        }
    };

    get collection() {
        return firestore().collection(collectionName);
    }

    get uid() {
        console.info("Get current user uid", auth().currentUser);
        return (auth().currentUser || {}).uid;
    }

    get timestamp() {
        return Date.now();
    }
}

Fire.shared = new Fire();
export default Fire;
