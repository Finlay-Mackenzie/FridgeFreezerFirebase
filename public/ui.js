// This file handles all the HTML reference and error codes seperately to make the main script cleaner

function uiJSworking(){
  console.log("ui javascript working.")
}
uiJSworking()


// linking variables to their HTML counterparts
import { AuthErrorCodes } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

// sign in related HTML elements
export const txtEmail = document.querySelector('#txtEmail')
export const txtPassword = document.querySelector('#txtPassword')
export const btnLogin = document.querySelector('#btnLogin')
export const btnSignup = document.querySelector('#btnSignup')
export const divLoginError = document.querySelector('#divLoginError')
export const lblLoginErrorMessage = document.querySelector('#lblLoginErrorMessage')
export const btnLogout = document.querySelector('#btnLogout')

// add item related HTML elements
export const txtBarcode = document.querySelector('#txtBarcode')
export const txtName = document.querySelector('#txtName')
export const txtQuantity = document.querySelector('#txtQuantity')
export const txtDaysTillExpiry = document.querySelector('#txtDaysTillExpiry')
export const btnSubmitNewItem = document.querySelector('#btnSubmitNewItem')
export const divAddItemError = document.querySelector('#divAddItemError')
export const lblAddItemErrorMessage = document.querySelector('#lblAddItemErrorMessage')


// view Database related HTML elements
export const btnRequestDBrecords = document.querySelector('#btnRequestDBrecords')
export const fridgeFreezerData = document.querySelector('#fridgeFreezerData')

// view general navigation related HTML elements
export const btnAddItemFormPopup = document.querySelector('#btnAddItemFormPopup')
export const btnViewDBFormPopup = document.querySelector('#btnViewDBFormPopup')
export const btnReturnHome = document.querySelector('#btnReturnHome')

// general user auth management related HTML elements
export const divAuthState = document.querySelector('#divAuthState')
export const lblAuthState = document.querySelector('#lblAuthState')
export const currentEntries = document.querySelector('#currentEntries')

// shows login form and hides app
export const showLoginForm = () => {
  document.body.style.background = 'url(https://images.unsplash.com/photo-1514237487632-b60bc844a47d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=43bbc10b34024dfca3f75d1f0b8dac3e.jpg)'
  login.style.display = 'block'
  app.style.display = 'none'
  addItemPopup.style.display = 'none'
  viewDatabasePopup.style.display = 'none'
}

// oposite of show login, changes background 
export const showApp = () => {
  document.body.style.background = 'none'
  document.body.style.backgroundColor = 'lightgrey'

  app.style.display = 'block'
  login.style.display = 'none'
  addItemPopup.style.display = 'none'
  viewDatabasePopup.style.display = 'none'
}

export const hideLoginError = () => {
  divLoginError.style.display = 'none'
  lblLoginErrorMessage.innerHTML = ''
}

// Function to give defined errors to the user instead of illegible firebase error codes. univeral accross all functions and leads to better user experiecne 
export const showLoginError = (error) => {
  // changes the login error box from hidden (with style.display being "none") to "block" which shows the box.
  divLoginError.style.display = 'block'


  if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
    lblLoginErrorMessage.innerHTML = `Your email account is registered however the password is invalid. Re-enter password to sign in.`
  }
  else if (document.getElementById("txtEmail").value == "") {
    lblLoginErrorMessage.innerHTML = 'Please enter an email address to sign in.'
  }
  else if (document.getElementById("txtPassword").value == "") {
    lblLoginErrorMessage.innerHTML = 'Please enter a password for this account.'
  }
  else if (error.code == AuthErrorCodes.INVALID_EMAIL) {
    lblLoginErrorMessage.innerHTML = `This email account is not currently registered or is not detected as an email address. If you would like to create an account, press create acount instead`
  }
  else if (error.code == AuthErrorCodes.WEAK_PASSWORD) {
    lblLoginErrorMessage.innerHTML = `The password you have used is not strong enough. Please enter at least six characters to proceed.`
  }
  else if (error.code == AuthErrorCodes.EMAIL_EXISTS) {
    lblLoginErrorMessage.innerHTML = `This email account is already registered. Please login instead`
  }
  else {
    lblLoginErrorMessage.innerHTML = `The fridge freezer sign in ran into an unaccounted Error: ${error.message}. Please close the website, clear cookies and reopen`
  }
}


// Function to give defined errors to the user instead of illegible firebase error codes. univeral accross all functions and leads to better user experiecne 
export const showAddItemError = (error) => {
  // changes the login error box from hidden (with style.display being "none") to "block" which shows the box.
  divAddItemError.style.display = 'block'


  if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
    lblAddItemErrorMessage.innerHTML = `Your email account is registered however the password is invalid. Re-enter password to sign in.`
  }
  else if (error.code == AuthErrorCodes.EMAIL_EXISTS) {
    lblAddItemErrorMessage.innerHTML = `This email account is already registered. Please login instead`
  }
  else {
    lblAddItemErrorMessage.innerHTML = `There was an error when adding this entry to the database collection. The unforseen error code is: ${error}`
}}

export const hideAddItemError = () => {
  divAddItemError.style.display = 'none'
  lblAddItemErrorMessage.innerHTML = ''
}


export const showLoginState = (user) => {
  lblAuthState.innerHTML = `Welcolme to your inventory management portal, ${user.email}. `
}



hideLoginError()
hideAddItemError()