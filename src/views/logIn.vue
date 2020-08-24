<template>
  <div id="login">

     <div class="hero">
      <div class="hero-top" id="nav-bar">
        <h1 class="hero-title"> {{sectionTitle}} </h1>
        <div class="hero-icon"></div>
      </div>

      <div class="hero-bottom">
        <div class="hero-content">
           <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <section>
      <div class="col2">
        <!-- LOGIN FORM -->
        <div v-if="showLoginForm" class='aForm' >
          <div class='formInputs'>
             <div class='formRow'> <label for="email1">Email:</label>
          <input v-model.trim="loginForm.email" type="text" placeholder="you@email.com" id="email1" /></div>
           
<div class='formRow'>
          <label for="password1" >Password:</label>
          <input
            v-model.trim="loginForm.password"
            type="password"
            placeholder="******"
            id="password1"
          /></div>
          </div>
         

          <button @click="login" v-on:keyup.enter="login()">Log-In</button>

          <div class="extras formRow">
            <button @click="togglePasswordReset">Forgot Password</button>
            <button @click="toggleForm">Register</button>
          </div>
        </div>

        <!-- SIGNUP -->
        <div v-if="!showLoginForm && !showForgotPassword" class='aForm'>
<div class='formRow'>
          <label for="name">First Name:</label>
          <input v-model.trim="signupForm.name" type="text" placeholder="Tamira" id="name" />
</div>
<div class='formRow'>
          <label for="lastName">Last Name:</label>
          <input v-model.trim="signupForm.lastName" type="text" placeholder="Jones" id="lastName" />
</div><div class='formRow'>
          <label for="email2">Email:</label>
          <input
            v-model.trim="signupForm.email"
            type="text"
            placeholder="you@email.com"
            id="email2"
            required
          />
</div><div class='formRow'>
          <label for="password2">Password:</label>
          <input
            v-model.trim="signupForm.password"
            type="password"
            placeholder="min 6 characters"
            id="password2"
          />
</div>
          <button @click="signup" v-on:keyup.enter="signup()">Register</button>

          <div class="extras">
            <button @click="toggleForm">Back to Log-In</button>
          </div>
        </div>
        <div v-if="showForgotPassword"  class="password-reset">
          <div v-if="!passwordResetSuccess">
            <p>We will send you an email to reset your password</p>

            <label for="email3">Email</label>
            <input
              v-model.trim="passwordForm.email"
              type="text"
              placeholder="you@email.com"
              id="email3"
            />

            <button @click="resetPassword" v-on:keyup.enter="resetPassword()">Submit</button>

            <div class="extras">
              <button @click="togglePasswordReset">Back to Log-In</button>
            </div>
          </div>
          <div v-else>
            <h1>Email Sent</h1>
            <p>check your email for a link to reset your password</p>
            <button @click="togglePasswordReset" >Back to log-in</button>
          </div>
        </div>
        <transition name="fade">
          <div v-if="errorMsg !== ''" class="error-msg">
            <p>{{ errorMsg }}</p>
          </div>
        </transition>
      </div>
    </section>
        </div>
      </div>
    </div>   


   
  </div>
</template>

<script>
const fb = require("../firebaseConfig.js");
import {mapState} from 'vuex'
export default {
  data() {
    return {
      sectionTitle: "Log-In",
      loginForm: {
        email: "",
        password: ""
      },
      signupForm: {
        name: "",
        lastName: "",
        email: "",
        password: ""
      },
      passwordForm: {
        email: ""
      },
      showLoginForm: true,
      showForgotPassword: false,
      performingRequest: false,
      errorMsg: "",
      passwordResetSuccess: false
    };
  },
  computed: {
    ...mapState(['currentUser'])
  },
  methods: {
    toggleForm() {
      this.errorMsg = "";
      this.showLoginForm = !this.showLoginForm;
      switch(this.showLoginForm) {
        case(true):
          this.sectionTitle = "Log-In";
          break;
        default:
          this.sectionTitle = "Register"}
    },
    togglePasswordReset() {
      if (this.showForgotPassword) {
        this.showLoginForm = true;
        this.showForgotPassword = false;
        this.passwordResetSuccess = false;
        this.sectionTitle = "Log-In"
      } else {
        this.showLoginForm = false;
        this.showForgotPassword = true;
        this.sectionTitle = "Forgot Password"
      }
    },
    login() {
      console.log("login");
      if (this.loginForm.email == "") {
        this.$toasted.show("Please enter an email.");
        return;
      }
      if (this.loginForm.password == "") {
        this.$toasted.show("Please enter a password.");
        return;
      }
      // this.performingRequest = true;
      fb.auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(() => {          
          // Sign-in triggers auth state change to save user and get profile into state
          // https://stackoverflow.com/questions/45204288/initialize-vue-app-after-firebase-auth-state-changed
          this.performingRequest = false;
          this.$router.push("/trips");
        })
        .catch(err => {
          this.$toasted.show(err.message);
          this.performingRequest = false;
        });
    },
    signup: function() {
      // Form validation
      if (this.signupForm.name == "") {
        this.$toasted.show("Please enter a first name.");
        return;
      }
      if (this.signupForm.email == "") {
        this.$toasted.show("Please enter an email.");
        return;
      }
      if (this.signupForm.password == "") {
        this.$toasted.show("Please enter a password.");
        return;
      }
      this.performingRequest = true;
      // todo: error account exists/email used
      // todo: reset password? forgot pw?
      //      firebase.auth Error Codes
      // auth/email-already-in-use
      // Thrown if there already exists an account with the given email address.
      // auth/invalid-email
      // Thrown if the email address is not valid.
      // auth/operation-not-allowed
      // Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.
      // auth/weak-password
      // Thrown if the password is not strong enough.
      fb.auth
        .createUserWithEmailAndPassword(
          // THIS TRIGGERS A SIGN-IN WHICH TRIGGERS ONAUTHSTATECHANGE(), USER IS SAVED
          // BUT PROFILE IS EMPTY
          this.signupForm.email,
          this.signupForm.password
        )
        .then(user => {
          console.log(
            "auth finished created user obj, any authStateChange should be exited", user
          ); // here it says reason is 'signin/ or something? Additional inof. user.user is teh actual user

          //Set profile name on auth user now
          user.user.updateProfile({displayName: this.signupForm.name})
          
            .then(res => {
              // coMMIT user state here beuase the display name is assigned and there won't be data update issues
              // When I did it before the nav bar greeting didn't work until a click? wierd
              this.$store.commit('setCurrentUser', user.user)
              if (res === "empty") {
                console.log("authchange has nto run...");
                this.$toasted.show('Race condition assign versus save :/')
              } else {
                console.log("assigned display name as first name" ); //TODO: what if a trip has 2 people same name?
               // create user obj
          let profilePromise = fb.db
            .collection("users")
            .doc(user.user.uid)
            .set({
              name: this.signupForm.name, // keep bc for now using when search by email and query name from uid client-side
              lastName: this.signupForm.lastName,
              email: this.signupForm.email
              // title: this.signupForm.title
            });
          profilePromise
            .then(() => {
              console.log('fetch profile')
              this.$store.dispatch("fetchUserProfile");
              // Strange issue trying to debug, 'empty' existing collections.
              // Might be because of not created ancestor first explicity so here...
              console.log('create empty individual gear doc')
              // GEAR
       fb.db.collection('individualGear').doc(user.user.uid).set({})
        // MEALS
        fb.db.collection('individualMeals').doc(user.user.uid).set({})
              console.log('create empty notification logs')
              fb.db
                .collection("userNotifications")
                .doc(user.user.uid)
                .set({ null: null })
                .then(() => {
                  this.performingRequest = false;
                  this.$router.push("/dashboard");
                });
            })
            .catch(err => {
              this.$toasted.show(err.message);
              this.performingRequest = false;
            });
              }
            })
            .catch(err => {
              this.$toasted.show(err.message);
              this.performingRequest = false;
            });

          // 2
          
          console.log("create profile for ", user.user.uid);
         
        })
        .catch(err => {
          this.$toasted.show(err.message);

          this.performingRequest = false;
        });
    },

    resetPassword() {
      this.performingRequest = true;
      fb.auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.performingRequest = false;
          this.passwordResetSuccess = true;
          this.passwordForm.email = "";
        })
        .catch(err => {
          console.log(err);
          this.performingRequest = false;
          this.errorMsg = err.message;
        });
    }
  }
};
</script>

<style scoped>
#login {
    position: relative;
    top: 54px;
}
button {
  cursor: pointer;
   font-size: .9rem;
  padding: 5px;
  width: 150px;
  color: #6a6a6a;
      margin: 15px;
    align-self: center;
    border-radius: 3px;
    border:none;
    box-shadow: 1px 1px 3px 1px rgba(57, 57, 57, 0.2);
}
button:hover {
  background: #d3eee1;
}
label {
  color: #202020;
  font-size: 1.1rem;
      width: 100px;
    text-align: right;
}
.aForm {
  display: flex;
  flex-direction: column;
}
.formInputs {
  margin-bottom: 20px;
}
.formRow {
  display: flex;
  flex-direction: row;
  padding: 10px;
  justify-content: center;
}
.formRow > input {
  flex: 1;
}
.formRow > label {
  margin-right: 10px;
}

/* HERO CSS */
.hero {
  display: flex;
  flex-flow: column nowrap;
  background: linear-gradient(
      rgba(45, 45, 45, 0.6),
      rgba(0, 0, 0, 0.37),
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5)
    ),
    url(../assets/tyssul-patel-o-zOatT4kQw-unsplash.jpg) no-repeat;
  background-size: cover;
  /* height: 490px; */
  width: 100%;
  /*margin-bottom: 15px;*/
}
.hero-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-between; */
  /* padding: 15px 0; */
  color: #f7ffff;
  padding: 10px 5px 30px 5px;
}

.hero-bottom {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  flex: 1;
  padding: 0 15px;
}
.hero-icon {
  background: url("../assets/CampingW.png") no-repeat center center;
  background-size: contain;
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
}

</style>