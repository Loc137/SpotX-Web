
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"; 
import { auth, db } from './firebase-config.js';

// Input elements
const inpUsername = document.querySelector(".inp-username");
const inpEmail = document.querySelector(".inp-email");
const inpPwd = document.querySelector(".inp-pwd");
const inpConfirmPwd = document.querySelector(".inp-cf-pw");
const registerForm = document.querySelector("#register-form");

const googleSignInButton = document.querySelector("#googleSignInButton");


// Handle register
async function handleRegister(event) {
  event.preventDefault(); // ngăn reload form

  const username = inpUsername.value.trim();
  const email = inpEmail.value.trim();
  const password = inpPwd.value;
  const confirmPassword = inpConfirmPwd.value;
  const role_id = 2; // guest = 2, admin = 1

  // Kiểm tra input
  if (!username || !email || !password || !confirmPassword) {
    alert("Please fill all the fields!");
    return;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Tạo user trong Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Data lưu trong Firestore
    const userData = {
      username,
      email,
      role_id,
      balance: 0,
      createdAt: new Date()
    };

    // Lưu vào Firestore, document id = uid
    await setDoc(doc(db, "users", user.uid), userData);
    alert("Register successfully!!");
    window.location.href = './home.html';
  } catch (error) {
    console.error("Error: ", error.message);
    alert("Lỗi: " + error.message);
  }
}

// Gán sự kiện submit cho form
registerForm.addEventListener("submit", handleRegister);



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
