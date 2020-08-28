<template>
  <header>
    <section class='nav'>
      <div>
        <!-- <div class="logo-wrap"><i class="material-icons"> near_me </i>	</div> -->
        <router-link to="home" class="hero-icon"></router-link>
      </div>
      <div class='row rowStyle'>
        <div v-if="!currentUser">
          <router-link to="/login">Login</router-link>
        </div>        
        <div v-if="currentUser" class="nav-menu">
          <div>Hi, {{currentUser.displayName}}!</div>
          
        </div>
       
      </div>
    </section>
  </header>
</template>

<script>
import { mapState } from "vuex";

export default {
  
  computed: {
    ...mapState(["currentUser"]),
  }  
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 30px;
}
.rowStyle {
  align-items:center;
}
.nav {
  top: 0;
    left: 0;
    right: 0;
    position: fixed;
    background: #ececec;
    z-index: 100;
}
.nav-menu {
  /* padding: 0 15px; */
  /* background-color: #f7f7f7; */
  width: 120px;
  font-size: 1.2rem;  
  color: #054d6b;
}
.menu {
  position: absolute;
  /* padding-top: 15px; */
  /* background-color: #f7f7f7; */
  width: inherit;

  box-shadow: 1px 1px 3px 1px rgba(57, 57, 57, 0.2);
}
/* .selected-menu-class {    
} */
.menu-item {
  font-size: 1.1rem;
  padding: 15px;
}
.col {
  display: flex;
  margin: 0 10px;
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
  background: url("../../assets/Camping.png") no-repeat center center;
  background-size: contain;
  width: 25px;
  height: 25px;
  margin-bottom: 0;
}
</style>