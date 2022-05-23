/*
Main javascript file for the application. The first imports at the top are needed to access firebase's
SDK tooling. The app is linked with firebase with the unique identifiers in the "firebase config" function
The main Javascript for the actual website is located below this 
*/


function indexJSworking(){
    console.log("index javascript working.")
}
indexJSworking()

// Gathering the imports from the sister JS file "UI" which is handling all the user message feedback and notifications
// done deliberately as it allows a cleaner main script.

import {

    // imports needed for sign in
    hideLoginError,
    showLoginState,
    showLoginError,

    btnLogin,
    btnSignup,
    btnLogout,

    // imports needed to add new item
    txtBarcode,
    txtName,
    txtQuantity,
    txtDaysTillExpiry,
    showAddItemError,

    // import needed to view DB button
    btnRequestDBrecords,
    fridgeFreezerData,

    // imports needed for the navigation bar / showing and hiding the UI elements
    showLoginForm,
    showApp,
    btnAddItemFormPopup,
    btnViewDBFormPopup,
    btnReturnHome,
    currentEntries,


  } from "./ui.js";
//                                Link to firebase services setup
// # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #

// importing Firebase's required SDK toolkit first. This is the core SDK needed for firebase to work.
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";


// Importing the nessasary functions to use the user authentication on firebase. These functions handle auth
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";


// Firestore database imported functions here. This allows the use of firebase's different services
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    query,
    where,
    orderBy,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";


// Firebase's unique settings for this application specifically. Needed to link with the backend
// Initialize Firebase using the unique IDs from the config file.
const firebaseApp = initializeApp({
        apiKey: "AIzaSyAuU2wt7LJgrQrCDxJNEPo8r1BBrg8A1c0",
        authDomain: "fridge-freezer-app-61279.firebaseapp.com",
        projectId: "fridge-freezer-app-61279",
        storageBucket: "fridge-freezer-app-61279.appspot.com",
        messagingSenderId: "1039516325706",
        appId: "1:1039516325706:web:c4ad280823867a8335d3b3"
    })

// the "auth" also initialized here to connect with firebase
const auth = getAuth(firebaseApp)

// the "db" doesn't refere to the database itself, more the connection to firebase
const db = getFirestore(firebaseApp)
const collectionReference = collection(db, 'foodItems')

// query filtered by soonest to go off
const soonestToGoOffQuery = query(collectionReference, orderBy('itemDaysTillExpiry', 'asc'))



var globalFoodItems = null
//                                Main Javascript beyond this point
// # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #


// Login using email/password function. Pulls values from form and submits using firebase function signInWithEmailAndPassword
const loginEmailPassword = async () => {
    const loginEmail = txtEmail.value
    const loginPassword = txtPassword.value
     try {
       await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
       returnHome()
     }
     catch(error) {
       showLoginError(error)
     }
  }

  // Create new account using email/password function. much the same as above with differing "createUserWithEmailAndPassword" function
  const createAccount = async () => {
    const email = txtEmail.value
    const password = txtPassword.value
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      returnHome()
    }
    catch(error) {
      showLoginError(error)
    }
  }


  // Monitor auth state. If not logged in, return user to form. If logged in can show app
  const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        showApp()
        showLoginState(user)
        hideLoginError()
      }
      else {
        showLoginForm()
        lblAuthState.innerHTML = `You're not logged in.`
      }
    })
  }


  // Logs the user out with FB function and clears input fileds for new sign in
  const logout = async () => {
    await signOut(auth);
    document.getElementById("txtEmail").value = ""
    document.getElementById("txtPassword").value = ""
  }

  const displayNewItemForm = async () => {
    homePageHeader.style.display = 'none'
    HomePageWelcolmeAndInfo.style.display = 'none'
    addItemPopup.style.display = 'block'
  }

  const displayViewDatabaseForm = async () => {
    homePageHeader.style.display = 'none'
    HomePageWelcolmeAndInfo.style.display = 'none'
    viewDatabasePopup.style.display = 'block'
  }

  const returnHome = async () => {
    homePageHeader.style.display = 'block'
    HomePageWelcolmeAndInfo.style.display = 'block'
    viewDatabasePopup.style.display = 'none'
    addItemPopup.style.display = 'none'
    currentEntries.innerHTML = ""
    viewDB
    if (globalFoodItems == null) {
      document.getElementById("currentEntries").innerHTML = "click \"view database\" (clipboard on the nav bar) to show how many entries there are."
  
    }
    else {
      console.log("global food items array: "+ String(globalFoodItems.length))
      document.getElementById("currentEntries").innerHTML = "you currently have: "+ String(globalFoodItems.length)+" items in your fridge freezer."
  
    }


    // Clearing the add item fields incase there were half-entered records
    document.getElementById("txtBarcode").value = ""
    document.getElementById("txtName").value = ""
    document.getElementById("txtQuantity").value = ""
    document.getElementById("txtDaysTillExpiry").value = ""
  }


  // Create new item in the database and shows the add item popup
  const addItemToDB = async (e) => {
    e.preventDefault()

    const barcodeEntry = Number(txtBarcode.value)
    const nameEntry = String(txtName.value)
    const quantityEntry = Number(txtQuantity.value)
    const expiryEntry = Number(txtDaysTillExpiry.value)

    try {
      await addDoc(collectionReference, {
        barcodeID: barcodeEntry,
        itemName: nameEntry,
        itemQuantity: quantityEntry,
        itemDaysTillExpiry: expiryEntry
      })
      console.log("attempted to add items: barcode ID: "+ String(barcodeEntry)+" item name: "+ String(nameEntry) + " item quantity: "+String(quantityEntry)+" days to expiry: "+String(expiryEntry)+".")
      addItemPopup.style.display = 'none'
      returnHome()
    }
    catch(error) {
      showAddItemError(error)
    }
  }

  function displayGlobalFoodItems(){
    console.log(globalFoodItems)
  }

    // view the Collection contents
    const viewDB = async (e) => {
      e.preventDefault()
        try {
            await onSnapshot(soonestToGoOffQuery, (mostRecentDBinstance) => {
              let foodItems = []
              mostRecentDBinstance.docs.forEach((individualRecord) => {
                  foodItems.push({ ...individualRecord.data(), id: individualRecord.id })
              })

              globalFoodItems = foodItems
              document.getElementById("numberOfEntriesInDB").innerHTML = "You currently have: " + String(globalFoodItems.length) +" entries in your fridge freezer."

              // updates the current entries on the homepage too.
              document.getElementById("currentEntries").innerHTML = "You currently have: " + String(globalFoodItems.length) +" entries in your fridge freezer."
              displayGlobalFoodItems()

              createDBtable(foodItems)
            })
          }
        catch(error) {
          console.log(`There was an error with the database query, error code: (${error})`)
          showLoginError(error)
        }
      }

          // view the Collection contents
    function createDBtable(cleanedUpArray){
      console.log("creating db table.")
      fridgeFreezerData.innerHTML = ''



      for (var i = 0; i < cleanedUpArray.length; i++){
        var row = `<tr>
        <td>${cleanedUpArray[i].barcodeID}</td>
        <td>${cleanedUpArray[i].itemName}</td>
        <td>${cleanedUpArray[i].itemQuantity}</td>
        <td>${cleanedUpArray[i].itemDaysTillExpiry}</td>
      </tr>`
      fridgeFreezerData.innerHTML += row
    }
  }


// runs the key functions when the buttons are pressed from html
  btnLogin.addEventListener("click", loginEmailPassword)
  btnSignup.addEventListener("click", createAccount)
  btnLogout.addEventListener("click", logout)


  btnAddItemFormPopup.addEventListener("click", displayNewItemForm)
  btnViewDBFormPopup.addEventListener("click", displayViewDatabaseForm)
  btnReturnHome.addEventListener("click", returnHome)

  btnSubmitNewItem.addEventListener("click", addItemToDB)
  btnRequestDBrecords.addEventListener("click", viewDB)

  monitorAuthState()




// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
