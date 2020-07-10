<template>
  <header>
    <section>
      <div class="col1">
        <!-- <div class="logo-wrap"><i class="material-icons"> near_me </i>	</div> -->
        <router-link to="home" class="hero-icon"></router-link>
      </div>
      <div class="col2">
        <div v-if="!currentUser">
          <router-link to="/login">Login</router-link>
        </div>

        <div v-if="currentUser" class="nav-menu" >
          <div  v-on:click='toggleAccount'>Hi, {{userProfile.name}}!</div>
          <div v-show="accountShow" class="menu">
            <div class="menu-item" v-on:click='toggleAccount'>
              <router-link to="/settings">Settings</router-link>
            </div>
            <div class="menu-item" v-on:click='toggleAccount'>
              <a @click="logout">Logout</a>
            </div>
          </div>
        </div>

        <div v-if="currentUser" class="nav-menu">
          <div  v-on:click='toggleDashboard'>Dashboard</div>
          <div v-show="dashboardShow" class="menu">
            
                <div class="menu-item" v-on:click='toggleDashboard'><router-link to="/trips">Trips</router-link></div>
              <div class="menu-item" v-on:click='toggleDashboard'><router-link to="/list">Lists</router-link></div>
            
          </div>
        </div>
      </div>
    </section>
  </header>
</template>

<script>
const fb = require("../firebaseConfig.js");
import { mapState } from "vuex";

export default {
  data: function() {
    return {
        accountShow: false,
        dashboardShow: false
    };
  },
  computed: {
    ...mapState(["currentUser", "userProfile"])
  },
  methods: {
      toggleAccount() {
this.accountShow = !this.accountShow;
if(this.dashboardShow==true) {this.dashboardShow=false;}
      },
      toggleDashboard() {
this.dashboardShow = !this.dashboardShow;
if(this.accountShow==true){this.accountShow=false;}
      },
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch("clearData");
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
}
.nav-menu {
  padding: 0 15px;
  background-color: #f7f7f7;
  width: 120px;
  font-size: 1.2rem;
}
.menu {
  position: absolute;
  /* padding-top: 15px; */
  background-color: #f7f7f7;
  width: inherit;
  
  box-shadow: 1px 1px 3px 1px rgba(57, 57, 57, 0.2);
}
/* .selected-menu-class {    
} */
.menu-item {
  font-size: 1.1rem;
  padding: 15px;
}
.col2 {
  display: flex;
  align-items: baseline;
}
a {
  color: #09709a;
}

a.router-link-exact-active {
  color: #42b983;
}
/* ul {
    display: flex;
    list-style-type: none;
    justify-content: center;
    align-items: center;
}
    li {
            margin-top: 4px;
            margin-left: 6px;
            
        }
    a {
                display: block;
                padding: 5px;
                text-decoration: none;
            } */
.hero-icon {
  background: url("../assets/Camping.png") no-repeat center center;
  background-size: contain;
  width: 25px;
  height: 25px;
  /* margin-bottom: 15px; */
}
</style>