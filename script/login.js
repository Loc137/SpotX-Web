import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const inpEmail = document.querySelector(".inp-email");
const inpPwd = document.querySelector(".inp-pwd");
const loginForm = document.querySelector("#login-form");

const handleLogin = function (event) {
    event.preventDefault();

    let email = inpEmail.value.trim()
    let password = inpPwd.value.trim();
    if (!email || !password) {
        alert("Vui lòng điền đầy đủ các trường dữ liệu");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            const userSession = {
                user: {
                    email: user.email
                },
                expiry: new Date().getTime() + 30 * 1000 // 2 hours
            };

            localStorage.setItem('user_session', JSON.stringify(userSession));
            localStorage.setItem("currentUser", JSON.stringify({email: user.email}));

            alert("Đăng nhập thành công!");

            window.location.href = './home.html';
        })
        .catch(e => {
            alert("Lỗi: " + e.message);
        });
};
loginForm.addEventListener("submit", handleLogin);
