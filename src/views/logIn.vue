<template>
  <div id="login">
    <transition name="fade">
      <div v-if="performingRequest" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <section>
      <div>Login/Register Page</div>
      <div class="col2">
        <form v-if="showLoginForm" @submit.prevent>
          <h1>Welcome Back</h1>

          <label for="email1">Email</label>
          <input v-model.trim="loginForm.email" type="text" placeholder="you@email.com" id="email1" />

          <label for="password1">Password</label>
          <input
            v-model.trim="loginForm.password"
            type="password"
            placeholder="******"
            id="password1"
          />

          <button @click="login" class="button">Log In</button>

          <div class="extras">
            <a @click="togglePasswordReset">Forgot Password</a>
            <a @click="toggleForm">Create an Account</a>
          </div>
        </form>

        <!-- SIGNUP -->
        <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent>
          <h1>Get Started</h1>

          <label for="name">First Name</label>
          <input v-model.trim="signupForm.name" type="text" placeholder="Tamira" id="name" />

          <label for="lastName">Last Name</label>
          <input v-model.trim="signupForm.lastName" type="text" placeholder="Jones" id="lastName" />

          <label for="email2">Email</label>
          <input
            v-model.trim="signupForm.email"
            type="text"
            placeholder="you@email.com"
            id="email2"
            required
          />

          <label for="password2">Password</label>
          <input
            v-model.trim="signupForm.password"
            type="password"
            placeholder="min 6 characters"
            id="password2"
          />

          <button @click="signup" class="button">Sign Up</button>

          <div class="extras">
            <a @click="toggleForm">Back to Log In</a>
          </div>
        </form>
        <form v-if="showForgotPassword" @submit.prevent class="password-reset">
          <div v-if="!passwordResetSuccess">
            <h1>Reset Password</h1>
            <p>We will send you an email to reset your password</p>

            <label for="email3">Email</label>
            <input
              v-model.trim="passwordForm.email"
              type="text"
              placeholder="you@email.com"
              id="email3"
            />

            <button @click="resetPassword" class="button">Submit</button>

            <div class="extras">
              <a @click="togglePasswordReset">Back to Log In</a>
            </div>
          </div>
          <div v-else>
            <h1>Email Sent</h1>
            <p>check your email for a link to reset your password</p>
            <button @click="togglePasswordReset" class="button">Back to login</button>
          </div>
        </form>
        <transition name="fade">
          <div v-if="errorMsg !== ''" class="error-msg">
            <p>{{ errorMsg }}</p>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
const fb = require("../firebaseConfig.js");
import {mapState} from 'vuex'
export default {
  data() {
    return {
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
    },
    togglePasswordReset() {
      if (this.showForgotPassword) {
        this.showLoginForm = true;
        this.showForgotPassword = false;
        this.passwordResetSuccess = false;
      } else {
        this.showLoginForm = false;
        this.showForgotPassword = true;
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
          this.$router.push("/dashboard");
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
          // this.$store
          //   .dispatch("assignDisplayName", {
          //     displayName: this.signupForm.name
          //   })
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