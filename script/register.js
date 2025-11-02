
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"; 
import { auth, db } from './firebase-config.js';

// Input elements
const inpUsername = document.querySelector(".inp-username");
const inpEmail = document.querySelector(".inp-email");
const inpPwd = document.querySelector(".inp-pwd");
const inpConfirmPwd = document.querySelector(".inp-cf-pw");
const registerForm = document.querySelector("#register-form");

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
    alert("Vui lòng điền đủ các trường");
    return;
  }
  if (password !== confirmPassword) {
    alert("Mật khẩu không khớp");
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
    alert("Đăng ký thành công!");
    registerForm.reset();
  } catch (error) {
    console.error("Error: ", error.message);
    alert("Lỗi: " + error.message);
  }
}

// Gán sự kiện submit cho form
registerForm.addEventListener("submit", handleRegister);
