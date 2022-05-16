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
    showLoginForm,
    showApp,
    showLoginError,
    btnLogin,
    btnSignup,
    btnLogout,

    // imports needed to add new item
    btnAddItem,
    txtBarcode,
    txtName,
    txtQuantity,

    // import needed to view DB button
    btnViewDB,

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
    getDocs,
    setDoc,
    addDoc,
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

//                                Main Javascript beyond this point
// # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ #
// Login using email/password function. Pulls values from form and submits using firebase function signInWithEmailAndPassword
const loginEmailPassword = async () => {
    const loginEmail = txtEmail.value
    const loginPassword = txtPassword.value

    // step 2: add error handling
     try {
       await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
     }
     catch(error) {
       console.log(`There was an error: ${error}`)
       showLoginError(error)
     }
  }

  // Create new account using email/password function. much the same as above with differing "createUserWithEmailAndPassword" function
  const createAccount = async () => {
    const email = txtEmail.value
    const password = txtPassword.value
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    }
    catch(error) {
      console.log(`There was an error: ${error}`)
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



  // Create new item in the database and shows the add item popup
  const addItemToDB = async (e) => {
    addItemPopup.style.display = 'block'
    e.preventDefault()

    const barcodeEntry = txtBarcode.value
    const nameEntry = txtName.value
    const quantityEntry = txtQuantity.value

    try {
      await addDoc(collectionReference, {
        barcodeID: barcodeEntry,
        itemName: nameEntry,
        itemQuantity: quantityEntry
      })

    }
    catch(error) {
      console.log(`There was an error when adding this entry to the database collection. The unforseen error code is: ${error}`)
      showLoginError(error)
    }
    //addItemPopup.style.display = 'none'
  }

    // Create new item in the database
    const viewDB = async () => {
        viewDatabasePopup.style.display = 'block'
        try {
            await getDocs(collectionReference)
            .then((dbInCurrentTime) => {
                let foodItems = []
                dbInCurrentTime.docs.forEach((doc) => {
                    foodItems.push({ ...doc.data(), id: doc.id })
                })
                console.log(foodItems)
                document.getElementById("databaseRecordsTextbox").innerHTML = foodItems
            })
        }
        catch(error) {
          console.log(`There was an error with the database query, error code: (${error})`)
          showLoginError(error)
        }
      }

// runs the key functions when the buttons are pressed from html
  btnLogin.addEventListener("click", loginEmailPassword)
  btnSignup.addEventListener("click", createAccount)
  btnLogout.addEventListener("click", logout)
  btnAddItem.addEventListener("click", addItemToDB)
  btnViewDB.addEventListener("click", viewDB)

  monitorAuthState()




// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
