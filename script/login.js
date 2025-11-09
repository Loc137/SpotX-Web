import { auth } from './firebase-config.js';
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const inpEmail = document.querySelector(".inp-email");
const inpPwd = document.querySelector(".inp-pwd");
const loginForm = document.querySelector("#login-form");

const googleSignInButton = document.querySelector("#googleSignInButton");

const handleLogin = function (event) {
    event.preventDefault();

    let email = inpEmail.value.trim()
    let password = inpPwd.value.trim();
    if (!email || !password) {
        alert("Please fill all the fields!");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            saveUserSession(user);

            alert("Log in successfully!");
            window.location.href = './home.html';
        })
        .catch(e => {
            alert("Lỗi: " + e.message);
        });
};
loginForm.addEventListener("submit", handleLogin);

async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
        prompt: 'select_account'
    });

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        saveUserSession(user);
        alert("Log in successfully!");
        window.location.href = './home.html';

    } catch (error) {
        console.error("Lỗi đăng nhập Google:", error);
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/popup-closed-by-user') {
            alert('Login window closed by user.');
        } else {
            alert(`Error: ${errorMessage}`);
        }
    }
}

if (googleSignInButton) {
    googleSignInButton.addEventListener('click', signInWithGoogle);
}

function saveUserSession(user) {
    const userSession = {
        user: {
            email: user.email,
            displayName: user.displayName || 'User',
            uid: user.uid,
            photoURL: user.photoURL || './IMG/default_avatar.png' // lưu avatar
        },
        expiry: new Date().getTime() + 7200000
    };

    localStorage.setItem('user_session', JSON.stringify(userSession));
    localStorage.setItem("currentUser", JSON.stringify({ email: user.email, photoURL: user.photoURL || './IMG/default_avatar.png' }));
}

