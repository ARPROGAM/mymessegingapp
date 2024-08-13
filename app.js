// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { getFirestore, collection, addDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyD-aXVbejLBN6zbXfke6lgHw9HV26Thh-M",
    authDomain: "mymessegingapp-921d0.firebaseapp.com",
    projectId: "mymessegingapp-921d0",
    storageBucket: "mymessegingapp-921d0.appspot.com",
    messagingSenderId: "540100762027",
    appId: "1:540100762027:web:916e8c7d1522ac6bb71aee"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

const login = async () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        await signInWithEmailAndPassword(auth, username, password);
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
        loadMessages();
    } catch (error) {
        document.getElementById('login-error').innerText = 'Invalid username or password';
    }
};

const logout = async () => {
    try {
        await signOut(auth);
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('chat-container').style.display = 'none';
    } catch (error) {
        console.error('Logout Error:', error);
    }
};

const sendMessage = async () => {
    const messageInput = document.getElementById('message-input');
    const fileInput = document.getElementById('file-input');
    const messageText = messageInput.value;

    if (messageText.trim() || fileInput.files.length) {
        try {
            let fileUrl = '';
            if (fileInput.files.length) {
                const file = fileInput.files[0];
                const fileRef = ref(storage, 'messages/' + file.name);
                await uploadBytes(fileRef, file);
                fileUrl = await getDownloadURL(fileRef);
            }

            await addDoc(collection(db, 'messages'), {
                text: messageText,
                fileUrl: fileUrl,
                timestamp: new Date(),
                user: auth.currentUser.email
            });

            messageInput.value = '';
            fileInput.value = '';
        } catch (error) {
            console.error('Send Message Error:', error);
        }
    }
};

const loadMessages = () => {
    const messagesContainer = document.getElementById('messages');

    onSnapshot(collection(db, 'messages'), (snapshot) => {
        messagesContainer.innerHTML = '';
        snapshot.forEach((doc) => {
            const message = doc.data();
            const messageElement = document.createElement('div');
            messageElement.innerText = message.text;
            if (message.fileUrl) {
                const fileLink = document.createElement('a');
                fileLink.href = message.fileUrl;
                fileLink.innerText = 'View File';
                fileLink.target = '_blank';
                messageElement.appendChild(fileLink);
            }
            messagesContainer.appendChild(messageElement);
        });
    });
};
