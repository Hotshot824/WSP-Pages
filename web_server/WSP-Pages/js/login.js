import { sha256 } from './hash.js';

// Sign Up
document.querySelector('#signUpForm').addEventListener('submit', async (event) => {
    let form = document.querySelector('#signUpForm');
    let formValid = form.checkValidity();
    if (formValid) {
        event.preventDefault();
        let formData = new FormData(form);
        let formDataObiect = Object.fromEntries(formData.entries());
        formDataObiect['password'] = sha256(formDataObiect['password']);
        let response = (async () => {
            return await fetch("../php/sign_up.php", {
                method: "POST",
                body: JSON.stringify(formDataObiect)
            })
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    console.log(`Error: ${error}`);
                })
        })();

        await response.then((response) => {
            console.log(response);
            if (response['error_status']) {
                switch (response['error_status']) {
                    case 1:
                        alert("Error: Database connection error!");
                        break;
                    case 2:
                        alert("Error: Account already existed!");
                        break;
                    case 3:
                        alert("Error: Incorrect invitation code!");
                        break;
                    default:
                }
                return;
            }

            alert("Account created successfully!")
            document.querySelector('#modalSignUp').querySelector('.btn-close').click();
            let input = document.querySelector('#modalSignUp').querySelectorAll('input');
            for (let i = 0; i < input.length; i++) {
                input[i].value = null;
            }
            document.querySelector('#modalSignUp').querySelector('.form-check-input').checked = false;

        });
    }
})

// Sign In
document.querySelector('#signInForm').addEventListener('submit', async (event) => {
    let form = document.querySelector('#signInForm');
    let formValid = form.checkValidity();
    if (formValid) {
        event.preventDefault();
        let formData = new FormData(form);
        let formDataObiect = Object.fromEntries(formData.entries());
        formDataObiect['password'] = sha256(formDataObiect['password']);
        let response = (async () => {
            return await fetch("../php/sign_in.php", {
                method: "POST",
                body: JSON.stringify(formDataObiect)
            })
                .then((response) => {
                    return response.json();
                })
                .catch((error) => {
                    console.log(`Error: ${error}`);
                })
        })();

        await response.then((response) => {
            console.log(response);
            if (response['error_status']) {
                switch (response['error_status']) {
                    case 1:
                        alert("Error: Database connection error!");
                        break;
                    case 2:
                        alert("Error: Account not existed!");
                        break;
                    case 3:
                        alert("Error: Password error!");
                        break;
                    default:
                }
                return;
            }

            alert("Password, true!");

            document.querySelector('#modalSignIn').querySelector('.btn-close').click();
            let input = document.querySelector('#modalSignIn').querySelectorAll('input');
            for (let i = 0; i < input.length; i++) {
                input[i].value = null;
            }

        });
    }
})
