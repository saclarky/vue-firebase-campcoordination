<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <form v-on:submit.prevent class="column columnStyle">
              
               <div class="row rowStyle">
                 Current Date: {{date}}
              </div>
              <div class="row rowStyle">
                <!-- <div style="font-size:.8rem; color:red;"> Required: </div> -->
                <v-date-picker mode="single" v-model="newDate" is-inline />
              </div>
              <div class="row rowStyle">
                 <div class="loader" v-if="showSpinner"></div>
                <input type="submit" class="rowItem" @click="editMealDate" value="Save" />
                <button class='rowItem' @click="$emit('close')">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      newDate:  new Date(Date.parse(this.date)),
       showSpinner: false
    }    
  },
  props: ["date", "tid", "page", "docIDs"],
  methods: {
     editMealDate(e) {
       e.preventDefault();
      this.showSpinner = true;
      let data = {
        page: this.page,
        date: this.date,
        tid: this.tid,
        ids: this.docIDs,
        newDate: this.newDate
      };      
      this.$store
        .dispatch("editMealDateAction", data)
        .then(() => {
              this.showSpinner = false;
          this.$toasted.show("Edited date!");
            this.$emit("close");         
        })
        .catch((e) => {
          this.showSpinner = false;
          console.log(e);
          this.$toasted.show(e.message);
          this.$emit("close")
        });
    }   
  }
};
</script>

<style scoped>
.columnStyle {
  justify-content: center;
}
.leftColumn {
  align-items: flex-start;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.modal-container {
  /* width: 300px; */
  max-height: 80%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow-y: scroll;
}

.modal-body {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.rowItem {
  padding: 3px 10px;
}
button.rowItem {
  margin-left: 10px;
}

/* .modal-default-button {
  float: right;
} */

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.rowStyle {
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}
input,
button {
  margin: 5px;
}
.header {
  margin-bottom: 15px;
 
}
.teal {
   color: #42b983;
}
.smText {
  font-size: 1rem;
}
.hidden {
  display: none;
}
</style>