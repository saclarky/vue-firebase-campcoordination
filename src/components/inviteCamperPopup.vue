<template>
     <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-header">
                  Invite a Friend to Join <slot name="body">
                  
                </slot> 
              </div>

              <div class="modal-body">
                
                <!-- TODO   explain you already have to be friends and they have an account, pass tid prop               -->
                    <label class='rowItem' for="newCamperEmail">Friend's Registered Email: </label>
                    <input class='rowItem' id="newCamperEmail" placeholder="Summer">
                    <button class='rowItem' @click="sendNewInvite">Save</button>
              </div>
              <div>Sorry about the using their email, still working out the best way to locate other users accurately</div>

              <div class="modal-footer">
                
                  <button @click="$emit('closeInvite')">
                    Cancel
                  </button>
                
              </div>
            </div>
          </div>
        </div>
      </transition>
</template>

<script>
export default {
   props: ['tripid'],
    methods: {
        sendNewInvite() {

            console.log(document.getElementById("newCamperEmail").value)
            // TODO: grab friends UID, grab trip id prop, and dispatch
            this.$store.dispatch('inviteCamper', {'email': document.getElementById("newCamperEmail").value, 'tid': this.tripid}).then((res) => {
                console.log(res)
 this.$emit('closeInvite')
            })
           
        }
    }
}
</script>

<style>
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
}

.modal-container {
  /* width: 300px; */
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  /* font-family: Helvetica, Arial, sans-serif; */
}

.modal-header {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.rowItem  {
    padding: 0 5px;
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
</style>