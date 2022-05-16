// Js file to handle the user interface errors and general notifications

// Login page JavaScript needed for the sign in page


// The generalized function used to set the notification message for every form on the sign in screen.
// Will take the formElement and type of notification along with the intended message as arguments
function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".formNotificationMsg");

    // pulls the existing message from the element, will remove the existing message
    // will attempt to remove the existing message (attempts to get rid of success and error msg so both are covered)
    // will then add the argument inputted from function type of msg and add it in place of the opposite
    messageElement.textContent = message;
    messageElement.classList.remove("formNotificationMsg--success", "formNotificationMsg--error");
    messageElement.classList.add(`formNotificationMsg--${type}`);
}

// Function to set the input message text to the error message. By default will be 'acceptable' input
// to message present but blank, this updates the error message to display the text chosen.
function setInputError(inputElement, message) {
    inputElement.classList.add("formInput--error");
    inputElement.parentElement.querySelector(".formInput-error-message").textContent = message;
}

// When the user input is deemed acceptable for the field, the error text is removed and the text
// replaced with "" which is not shown to the user and remains blank but there incase input no longer accepted.
function clearInputError(inputElement) {
    inputElement.classList.remove("formInput--error");
    inputElement.parentElement.querySelector(".formInput-error-message").textContent = "";
}

// Every other function the frontend needs is nested inside of this event listener "DOMContentLoaded"
// This holds off on running until the entire webpage document has been loaded
// This reduces errors as the script can run faster than the page contents, it may attempt to change / access
// elements not yet present causing a crash.
document.addEventListener("DOMContentLoaded", () => {

    // The main sign in form is actually three separate forms on the same tile. These are added to the class list on
    // first run and the user will transition between the main page and the two sub-pages by clicking text box
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
    const passwordReminderForm = document.querySelector("#passwordReminder");

    // When the user clicks the "create account" link, hides the login form and shows the create account form
    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    // When the user clicks the return to login page, removes the login page from the "hidden" list and
    // adds the create account form to the hidden list instead.
    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    // Same operation as the create account form, adds and removes visible forms depending on page
    document.querySelector("#linkPasswordReminder").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        passwordReminderForm.classList.remove("form--hidden");
    });


    // when the "submit" button is pressed, attempts a sign in with user credentials
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        // actual login stuff here
        // Perform your AJAX/Fetch login


        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });


    // an additional event listener that takes a form input and checks it against the input requirement stated.
    document.querySelectorAll(".formInput").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {

            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }

            if (e.target.id === "signupPasswordHint" && e.target.value == 5) {
                setInputError(inputElement, "password hint cannot be 5 characters")
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });


});