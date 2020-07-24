<template>
  <div class="main">
    <div class="header2">
      <div class="subNavMenuLeft"></div>
      <div class="subNavMenu">
        <div class="menu-item">
          <router-link to="/trips">Trips</router-link>
        </div>
      </div>
    </div>
    <div class="hero">
      <div class="hero-top" id="nav-bar">
        <h1 class="hero-title">{{thisTrip.name}}</h1>
        <h2>Started by {{thisTrip.owner}}</h2>
        <div class="hero-icon"></div>
      </div>
      <div class="hero-bottom">
        <div class="hero-content">
        </div>
      </div>
    </div>
    <div class="actionRow">
      <div class="leftArrowIcon clickable"></div>
      <router-link to="/trip">Trip</router-link>
      <p>&#47;&#47;</p>
      <p>Gear</p>
      <div class="actionRowPlaceholder"></div>
    </div>

    <div class="content">
      <div class="gridWrapper">
        <div>Group Gear</div>
        <div class="rightArrowIcon"></div>
        <div>My Gear</div>
      </div>
      
        <div v-show="!groupGearExists">Start a group gear list!</div>
  
<div class='addSection'>
      <input id="itemTitle" v-model="addGroupGearTitle" />
      <label for="itemTitle">Title:</label>
      <!-- TODO: domain? -->
      <input id="itemCat" v-model="addGroupGearCat" />
      <label for="itemCat">Category:</label>
      <button @click="addGroupGearItem">Add</button>
      <!-- TODO: Add w enter key -->
      </div>
      <div class="item" v-for="gear in thisTripGroupGear" :key="gear.id">
        <!-- input value isn't title, it's id for syncing data change with store/firestore -->
        <span class="cell category">{{gear.category}}</span>
        <input type="checkbox" :id="gear.id" :value="gear.id" :checked="gear.checked" @change="updateGroupGearItemStatus" />
        <label class="strikethrough" :for="gear.id">{{gear.title}}</label>
         <span class="cell">({{gear.campers.join(', ')}})</span>
        <!-- TODO: sort checked items to bottom of list? -->
        <i class='plusIcon cell' @click="updateGroupGearCampers({gid:gear.id,camperAdd:userProfile.name,camperRemove:''})"
        :class="{
      plusShow: !gear.campers.includes(userProfile.name),
      plusHide: gear.campers.includes(userProfile.name)
    }"></i>
        <i class='minusIcon cell' @click="updateGroupGearCampers({gid:gear.id,camperRemove:userProfile.name,camperAdd:''})"
        :class="{
      plusShow: gear.campers.includes(userProfile.name),
      plusHide: !gear.campers.includes(userProfile.name)
    }"></i>
        <!-- MINUS HERE -->
        <small class="cell text"  @click="toggleUpdateItem(gear.id, gear.title, gear.category, gear.campers)">Update</small> 
        <small class="cell text" @click="deleteGroupGearItem(gear.id)">Delete</small>
      </div>
    </div>
    <updateGearItemPopup v-if="showUpdateItem" @close="toggleUpdateItem()" :itemid="thisItemID" :itemtitle="thisItemTitle"
    :itemcat="thisItemCat">
      
            <!-- TODO: add a class on items being updated so other users can see? -->
    </updateGearItemPopup>
  </div>
</template>

<script>
import { mapState } from "vuex";
import updateGearItemPopup from '../components/updateGearItemPopup'
export default {
  name: "gear",
  created() {
    // TODO: if trip object empty route to trips
    if (this.thisTrip == {}) {
      console.log("no trip, pushing to trips");
      this.$router.push({ path: "/trips" });
    }
    console.log("VUE created");
    //TODO: If not logged in yet does it work?
    // TODO: getter for sorting??
    this.$store.dispatch("bindTripGroupGear").then(docs => {
      console.log("got gear list", docs);
      if (!docs) {
        console.log('no docs')
        this.groupGearExists = false;
        //TODO: templates or form for starting a gear list from scratch
      } else {
        console.log('exists')
        this.groupGearExists = true;
      }
    });
  },
  components: {
    updateGearItemPopup
  },
  computed: {
    ...mapState(["thisTrip", "thisTripGroupGear","userProfile"])
    
  },
  data: function() {
    return {
      showUpdateItem: false,
      thisItemID: '', // Pass ID prop into the updateItem popup for DB action
      thisItemTitle: '',
      thisItemCat: '',
      groupGearExists: false,
      addGroupGearTitle: "",
      addGroupGearCat: ""
    };
  },
  methods: {
    toggleUpdateItem(id, title, cat) {
      this.showUpdateItem = !this.showUpdateItem;
      this.thisItemID = id;
      this.thisItemTitle = title;
      this.thisItemCat = cat;
    },
    addGroupGearItem: function() {
      if (this.addGroupGearTitle !== "") {
        // TODO: injection threat check
        this.$store
          .dispatch("addGroupGearItemAction", {
            title: this.addGroupGearTitle,
            category: this.addGroupGearCat
          })
          .then(() => {
            this.$toasted.show("Added item!");
          })
          .catch(e => {
            this.$toasted.show(e.message);
          });
      } else {
        this.$toasted.show("Please enter a title for the item.");
      }
    },
    deleteGroupGearItem: function(itemID) {
      //TODO: confirm want to delete
      // change from button to top-level delete button that deletes checked boxes?
      // or... edit a template mode? where you can delete rows/add rows etc?
      this.$store
        .dispatch("deleteGroupGearItemAction", { id: itemID })
        .then(() => {
          this.$toasted.show("Deleted item!");
        })
        .catch(e => {
          this.$toasted.show(e.message);
        });
    },
    updateGroupGearItemStatus: function(item) {
      // console.log(item.target.value, item.target.checked);
      this.$store.dispatch("updateStatusAction", {
        id: item.target.value,
        status: item.target.checked
      });
      //TODO: return message (success/fail)
    },
    updateGroupGearCampers: function(data) {
      this.$store
        .dispatch("updateGroupGearCampersAction", data)
        .then(() => {
          this.$toasted.show("Updated item!");
          this.$emit("close");
        })
        .catch(e => {
          this.$toasted.show(e.message);
        });
    },
  }
};
</script>

<style scoped>
input[type="checkbox"]:checked + label.strikethrough {
  text-decoration: line-through;
}
h4 {
  margin: 0;
  padding: 0;
  font-size: 1.2rem;
}
/* HERO CSS */
.hero {
  display: flex;
  flex-flow: column nowrap;
  background: linear-gradient(
      rgba(45, 45, 45, 0.6),
      rgba(0, 0, 0, 0.37),
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5)
    ),
    url(../assets/ryan-bahm-fMMpsyHCeK0-unsplash.jpg) no-repeat 0 -135px;
  background-size: cover;
  height: 490px;
  width: 100%;
  /*margin-bottom: 15px;*/
}
.hero-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-between; */
  /* padding: 15px 0; */
  color: #f7ffff;
  padding: 10px 5px 30px 5px;
}

.hero-bottom {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  flex: 1;
  padding: 0 15px;
}
.hero-icon {
  background: url("../assets/CampingW.png") no-repeat center center;
  background-size: contain;
  width: 50px;
  height: 50px;
  margin-bottom: 15px;
}

/* Main Content */
.gridWrapper {
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.gridColumn {
  /* width: 150px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 1px 1px 3px 1px rgba(57, 57, 57, 0.2);
  padding: 10px;
  background: #95c9d1bf;
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

.plusIcon {
  background: url("../assets/add-plus.svg") no-repeat center center;
  background-size: contain;
  width: 25px;
  height: 25px;
  cursor: pointer;
  vertical-align: middle;
}
.minusIcon {
  background: url("../assets/add-minus.svg") no-repeat center center;
  background-size: contain;
  width: 25px;
  height: 25px;
  cursor: pointer;
  vertical-align: middle;
}
.plusHide {
  display: none;
}
.plusShow {
  display: inline-block;
} 
.leftArrowIcon {
  background: url("../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: black;
  transform: rotate(180deg); /*TODO in gimp*/
  cursor:pointer;
}
.rightArrowIcon {
  background: url("../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: gray;
}

.item {
  font-size: 1rem;
  line-height: 1.6rem;
  /* text-align: left; */
  margin: 5px 0;
}

/* messages section */
#messages {
  margin-top: 15px;
}

.cell {
  padding: 0 10px;
}
.text {
  text-decoration: underline;
}
.category {
font-size:.8rem;color:gray;
}
.addSection {
  margin: 20px 0;
}
</style>