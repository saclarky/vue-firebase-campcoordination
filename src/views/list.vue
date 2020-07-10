<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="@/assets/logo.png" id="vue-logo" /> -->
    <div class="title">
      <div>Dyn. Trip Name</div>
      <!-- <span> <button>Edit Packing List </button></span> -->
    </div>
    <input :value='itemInput' @keyup='updateItemInput' />
    <button @click="addToDo">Add</button>
    <!-- TODO: Add w enter key -->
    <div v-if="errors !== ''" id="errors">{{ errors }}</div>

    <div v-if="items && items.length > 0">    
      <div v-for="item in items" :key="item.id">
        <!-- input value isn't title, it's id for syncing data change with store/firestore -->
        <input type="checkbox" :id="item.id" :value="item.id" :checked="item.status" @change="updateStatus">
        <label class="strikethrough" :for="item.id"> {{item.title}} </label>
     <!-- TODO: sort checked items to bottom of list? -->
        <small style="text-decoration:underline;" @click="deleteItem(item.id)">Delete</small>      
      </div>
    </div>
  </div>
</template>


<script>
// import { db } from "@/main"
import { mapState } from 'vuex'
// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)
export default {
  name: "list",
  // store: store,
  // beforeCreate: function() {
  //   this.$store.dispatch("setItems");
  // },
  data: function() {
    return {
      test: []
    };
  },
  computed: 
    mapState(['items', 'itemInput', 'errors', 'thisTrip']),
  methods: { //CANNOT use arrow shorthand => for functions of need "this.$store"
    updateItemInput: function(e) {
      this.$store.commit('updateItemInputMutation', e.target.value);
    },
    addToDo: function() {     
        this.$store.dispatch('addToDoAction');
    },
    deleteItem: function(itemID) {
      //TODO: confirm want to delete
      // change from button to top-level delete button that deletes checked boxes?
      // or... edit a template mode? where you can delete rows/add rows etc?
        this.$store.dispatch('deleteItemAction', itemID);
     
    },
    updateStatus: function(item) {
      // console.log(item.target.value, item.target.checked);
      this.$store.dispatch('updateStatusAction', {id: item.target.value, status:item.target.checked})
      //TODO: return message (success/fail)
    }
  },
  

  created () {
    this.$store.dispatch('bindItemsRef')
  }
};
</script>

<style scoped>
input[type=checkbox]:checked + label.strikethrough{
  text-decoration: line-through;
}


input,
button {
  border: 0;
  
  margin: 0 0 10px;
  padding: 7px;
}

input {
  font-size: 12px;
}

button {
  background: #43b823;
  border: 0;
  text-transform: uppercase;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.title {
  font-size: 14px;
  font-weight: 700;
  padding: 0 0 10px 0;
  margin: 0 0 10px 0;
  border-bottom: 1px solid #666;
}

#errors {
  background: #a52222;
  color: #fff;
  padding: 5px;
}
</style>