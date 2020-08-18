<template>
  <div id="app">
    <navigation id="nav"></navigation>
    <router-view/>
  </div>
</template>

<script>
console.log("App!")
// import {mapState} from 'vuex'
import navigation from './components/navigation.vue'
export default {
  
  components: {navigation},
  computed: {
    // ...mapState(['currentUser'])
  }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300&display=swap');
@import '../node_modules/vue2-timepicker/dist/VueTimepicker.css';
html {
   overflow: auto;
   height: 100%;
}
body {
  
  box-sizing: border-box;
  margin: 0 auto;
  font-family: sans-serif;
    font-size: 16pt;
    padding: 0;
    height: 100%;
    width: 100%;
    /* font-family: 'Quicksand', sans-serif; */
   
    scroll-behavior: smooth;
    background-color: #f7f7f7;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
}
  
  p {
    line-height: 1.6rem;
    margin:0;
}

h1 {
    /*font-family: 'Special Elite', cursive;*/
    font-size: 2rem;
}

a {
    text-decoration: none;
    display: inline-block;
    color: black;
    font-size: 16pt;
    transition: .2s;
}
.grow {
    -webkit-transition: all 0.5s ease-out;
    -moz-transition: all 0.5s ease-out;
    -ms-transition: all 0.5s ease-out;
    -o-transition: all 0.5s ease-out;
    transition: all 0.5s ease-out;
}

.grow:hover {
    -webkit-transform: scale(1.1);
    -moz-transform: scale(1.1);
    -ms-transform: scale(1.1);
    -o-transform: scale(1.1);
    transform: scale(1.1);
}

.button {
    /*color: #07B7C5;*/
    /* color: #9ba5a2; */
    /* color: #09709a; */
    border-radius: 3px;
    /* border: 1px solid #129E71; */
    /* border: 1px solid #09709a; */
    /* box-shadow: 1px 1px rgba(176, 176, 176, 0.2); */
    box-shadow: 1px 1px 3px 1px rgba(57, 57, 57, 0.2);
    /* padding: 15px 30px; */
    /* background-color: white; */
}
.hero-cta-button {
    background-color: rgba(245, 245, 245, 0.9);
    font-size: 1.2rem;
    cursor: pointer;
}

.wrap {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 1120px;
    /* border-left: 1px solid #129E71;
	border-right: 1px solid #129E71; */
    /* box-shadow: 10px 5px 10px #a0a0a0; */
    /*height: 100%;*/
}
/* HEADING CSS */
.header2 {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  /* padding: 10px 0; */
  padding: 0 30px;
  background-color: #d6dee6;
}
.subNavMenuLeft {
  flex: 1;
}
.subNavMenu {
  display: flex;
  flex-direction: row;
  align-items: center;
    justify-content: flex-end;
  padding: 0 10px;
  /* width: 120px; */
}

/* .selected-menu-class {    
} */
.menu-item {
  padding: 5px 15px;
  font-size: 1rem;
}

.row {
    display: flex;
    flex-direction: row;
}
.column {
  display: flex;
  flex-direction: column;
}
.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #34db9b;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
