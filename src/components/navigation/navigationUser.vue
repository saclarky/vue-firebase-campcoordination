<template>
  <header>
    <section class='nav'>
      <div>
        <!-- <div class="logo-wrap"><i class="material-icons"> near_me </i>	</div> -->
      
      </div>
      <div class='row rowStyle'>
              
          <div class="menu-item" >
          <router-link to="/trips">Trips</router-link>
        </div>
         
          
            <div class="menu-item" >
              <router-link to="/settings">Account</router-link>
            </div>
            <div class="menu-item">
              <a @click="logout">Logout</a>
            </div>
      
   
      
      </div>
    </section>
  </header>
</template>

<script>


export default {
  data: function () {
    return {
    };
  },
 
  methods: {
    
    logout() {
      this.$store.dispatch('logout')
    },
  },
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}
.rowStyle {
  align-items:center;
}
.nav {
  top: 51px;
    left: 0;
    right: 0;
    position: fixed;
    background: #e2e2e2;
    z-index: 100;
}
.nav-menu {
  padding: 0 15px;
  /* background-color: #f7f7f7; */
  width: 120px;
  font-size: 1.2rem;
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

.col {
  display: flex;
  margin: 0 10px;
}
a {
  color: #09709a;
  font-size: 1.1rem;
  cursor:pointer;
}

a.router-link-exact-active {
  color: #43c3f7;
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

</style>