<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-body">
            <form v-on:submit.prevent class="column columnStyle">
              
               <div class="row rowStyle">
                 <input type="radio" name="dateFlex" value="true" id="flex" v-model="radioFlex" selected>
                 <label class="rowItem smText" for="flex">Flexible Dates</label>
                 <input type="radio" name="dateFlex" value="false" id="hard" v-model="radioFlex">
                 <label class="rowItem smText" for="hard">Fixed Dates</label>
              </div>
              <div class="row rowStyle">
                <!-- <div style="font-size:.8rem; color:red;"> Required: </div> -->
                <v-date-picker mode="range" v-model="range" is-inline />
              </div>
              <div class="row rowStyle">
                <input type="submit" class="rowItem" @click="suggestNewDate" value="Save" />
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
      range: {
        start: new Date(),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+2)
      },
      radioFlex: true
    }
  },
  props: ['tid'],
  methods: {
     suggestNewDate(e) {
       e.preventDefault();
      let data = {
        tid: this.tid,
        dateStart: this.range.start,
        dateEnd: this.range.end,
        flexible: this.radioFlex
      };
      // Add new date to tripDates
      this.$store.dispatch('newTripDate', data).then(() => {
        this.$emit("close");
       this.$toasted.show('Dates added!')
      }).catch(e => {
        console.log(e)
        this.$toasted.show(e.message)
      })
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