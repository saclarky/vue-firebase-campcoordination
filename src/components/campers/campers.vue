<template>
  <div>
   

    <div class="row">
    
      <div class="wrapper col1">
        <div>Confirmed, can edit trip page</div>
        <div v-for="(yes, uid) in thisTripCampers" :key="uid">
          {{yes}}
          <button @click="removeCamper(uid)" :class="{buttonDisabled: thisTrip.uid === uid} ">remove</button>
        </div>
        <div>Pending, can view trip page</div>
        <div v-for="(rsvp, uid) in thisTripCampersPending" :key="uid">
          {{rsvp}}
          <button @click="removeCamper(uid)">remove</button>
        </div>
        <div>Declined, no access to the trip</div>
        <div v-for="(no, uid) in thisTripCampersNo" :key="uid">
          {{no}}
          <button @click="removeCamper(uid)">remove</button>
        </div>
      </div>
     
    </div>
   
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: function() {
    return {
    
    };
  },
  computed: {

    ...mapState([
      "thisTripCampers",
      "thisTripCampersNo",
      "thisTripCampersPending",
      "thisTrip"
    ])
  },
  methods: {
    removeCamper(camperID) {
      // TODO: don't have 'remove' button by the camp owner. disabled?
      console.log("Remove ",camperID);
      if (camperID !== this.thisTrip.uid) {
         let camperTable
          let name
            if(Object.keys(this.thisTripCampers).includes(camperID)) {
              camperTable = 'campers'
              name= this.thisTripCampers[camperID]
            }
            if(Object.keys(this.thisTripCampersNo).includes(camperID)) {
              camperTable = 'campersNo'
              name= this.thisTripCampersNo[camperID]
            }if(Object.keys(this.thisTripCampersPending).includes(camperID)) {
              camperTable = 'campersPending'              
              name= this.thisTripCampersPending[camperID]
            }
            
        this.$store
          .dispatch("removeCamperAction", { 'cid': camperID, 'name': name, 'camperTable':camperTable })
          .then(() => {
            this.$toasted.show("Camper removed.");
          })
          .catch(e => {
            this.$toasted.show(e.message);
          });
      } else {
        this.$toasted.show("Cannot delete trip owner.");
      }
    }
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.actionRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  padding: 10px;
}
.actionRow > p {
  margin-left: 10px;
  font-size: 1rem;
}

.actionRowPlaceholder {
  flex: 1;
}

.clickable {
  cursor: pointer;
}
.logEntry {
  font-size: 1rem;
  font-style: italic;
  padding: 5px;
  display: inline;
}

.buttonDisabled {
  display: none;
}
</style>