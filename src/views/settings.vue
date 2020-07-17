<template>
    <section id="settings">
        <div class="col1">
            <h3>Settings</h3>
            <p>Update your profile</p>

            <transition name="fade">
                <p v-if="showSuccess" class="success">profile updated</p>
            </transition>

            <form @submit.prevent>
                <label for="name">Name</label>
                <input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name" />

                <!-- <label for="title">Job Title</label> -->
                <!-- <input v-model.trim="title" type="text" :placeholder="userProfile.title" id="title" /> -->

                <button @click="updateProfileMethod" class="button">Update Profile</button>
            </form>

             <form @submit.prevent>
                <label for="authname">Name</label>
                <input v-model.trim="authName" type="text" id="authname" />

                <!-- <label for="title">Job Title</label> -->
                <!-- <input v-model.trim="title" type="text" :placeholder="userProfile.title" id="title" /> -->

                <button @click="updateAuthMethod" class="button">Update User</button>
            </form>
        </div>
    </section>
</template>

<script>
import { mapState } from 'vuex'
    export default {
        data() {
            return {
                name: '',
                authName: '',
                showSuccess: false
            }
        },
    computed: {
    ...mapState(['currentUser','userProfile'])
  },
     methods: {
         deleteAccount: function() {
console.log("TODO- delete userNotifications, profiel, references and auth")
         },
         updateAuthMethod: function() {
             this.$store.dispatch('assignDisplayName', {displayName: this.authName }).then(() => {
               
      this.authname = '' //TODO: if success?
         this.showSuccess = true;
         this.$toasted.show("Name saved!")
             }).catch(e => {
                 this.$toasted.show(e.message)
             })
     } ,
         updateProfileMethod: function() {
             this.$store.dispatch('updateProfile', {name: this.name !== '' ? this.name : this.userProfile.name});
         this.name = '' //TODO: if success?
         this.showSuccess = true;

         setTimeout(() => {
             this.showSuccess = false;
         }, 2000);
         }

     } 
    }
</script>