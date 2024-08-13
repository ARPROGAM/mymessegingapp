// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-aXVbejLBN6zbXfke6lgHw9HV26Thh-M",
  authDomain: "mymessegingapp-921d0.firebaseapp.com",
  projectId: "mymessegingapp-921d0",
  storageBucket: "mymessegingapp-921d0.appspot.com",
  messagingSenderId: "540100762027",
  appId: "1:540100762027:web:916e8c7d1522ac6bb71aee"
    
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get elements
const loginBtn = document.getElementById('login-btn');
const chatDiv = document.getElementById('chat');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessage');

// Authenticate with Google
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

loginBtn.addEventListener('click', () => {
    auth.signInWithPopup(provider).then(result => {
        console.log(result.user);
        loginBtn.style.display = 'none';
        chatDiv.style.display = 'flex';
    }).catch(error => {
        console.error(error);
    });
});

// Send and display messages
const db = firebase.database();

sendMessageBtn.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        db.ref('messages').push().set({
            user: auth.currentUser.displayName,
            text: message,
            timestamp: Date.now()
        });
        messageInput.value = '';
    }
});

// Listen for new messages
db.ref('messages').on('child_added', (snapshot) => {
    const data = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.user}: ${data.text}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
