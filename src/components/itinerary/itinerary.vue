<template>
  <div>
     <div class="content">
      <div>
        <div >  
          
           <div class="row rowStyle"> <button @click='newEntry'>Add Entry</button>     
                
               
<input v-model='newEntryText' id='item' placeholder='e.g. Carpool meet-up'>


                <!-- <date-time-picker v-model="newEntryDate"></date-time-picker> -->

                <datetime-picker id="lbdtp" placeholder="Add date and time." :dayStr='lbds' :timeStr="lbts" btnStr="Save" timeType="minute" v-model="newEntryDate" ></datetime-picker>
              </div>   
          <div class="categoryGrid">
           
            <div
              class="categoryBlock"
              v-for="(day, date) in thisTripItineraryGrouped"
              :key="date"
            >
              <div class="categoryHeader">
                <div :class="icons" @click="toggleDate"></div>
                <div class="categoryTitle" :id="date">{{date}}</div>
                <!-- Ability to edit/delete full days -->
                <div class="editIcon" @click="toggleEditDate(date)">
                  <svg width="22px" height="22px" viewbox="0 0 22 22">
                    <path
                      fill="#c0c0c0"
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                    />
                  </svg>
                </div>
                <div class="deleteIcon" @click="toggleDeleteDate(date)">
                  <svg width="22px" height="22px" viewbox="0 0 22 22">
                    <path
                      fill="#c0c0c0"
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
                    />
                  </svg>
                </div>
              </div>
              <!-- Display schedule for this date -->
              <!-- <div> wrapper is just for show/hide -->
              <div :class="{collapse: collapseClass, collapseWrapper: true}">      
                <div class="item" v-for="entry in thisTripItineraryGrouped[date]" :key="entry.id">
                  <div class="lead" :id="entry.id">{{entry.time}}</div>
                  <div>{{entry.entry}}</div>                 
                  <div
                    class="editIcon"
                    @click="toggleUpdateItem(entry)"
                  >
                    <svg width="22px" height="22px" viewbox="0 0 22 22">
                      <path
                        fill="#c0c0c0"
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    </svg>
                  </div>
                  <div class="deleteIcon" @click="deleteItem(entry.id)">
                    <svg width="22px" height="22px" viewbox="0 0 22 22">
                      <path
                        fill="#c0c0c0"
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>     
    </div>
   
   
   <editItinDatePopup v-if="showEditDate" @close='function() {showEditDate = !showEditDate;}' :date="thisDate" :tid="thisTrip.id" :docIDs="timeMapIDs"></editItinDatePopup>
   <deleteItinDatePopup v-if="showDeleteDate" @close='function() {showDeleteDate = !showDeleteDate;}'  :tid="thisTrip.id" :docIDs="dateDocIDs"></deleteItinDatePopup>
   <editEntryPopup v-if="showUpdateItem" @close='function() {showUpdateItem = !showUpdateItem;}' :entry="thisEntry" :tid="thisTrip.id" ></editEntryPopup>
  <deleteEntryPopup v-if='showDeleteItem' @close='function() {showDeleteItem = !showDeleteItem;}' :id="thisItemID" :tid="thisTrip.id"></deleteEntryPopup>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import editItinDatePopup from "./editItinDatePopup";
import deleteItinDatePopup from './deleteItinDatePopup'
import editEntryPopup from './editEntryPopup'
import deleteEntryPopup from './deleteEntryPopup'
// import DateTimePicker from 'vue-vanilla-datetime-picker';
import { DatetimePicker } from '@livelybone/vue-datepicker'; // POssibly throws error on reroute to trips from refresh

export default {
  created() {
          if(this.$store.state.thisTrip.group === true) {
            this.whichPage = 'group'
            this.showGroupGear = true
          } else {
            this.whichPage = 'ind'
            this.showGroupGear = false
          }   
  },
  components: {
    // DateTimePicker,
    'datetime-picker': DatetimePicker,
    editItinDatePopup,
    deleteItinDatePopup,
    editEntryPopup,
    deleteEntryPopup
  },
  computed: {
    ...mapState(["thisTrip"]),
    ...mapGetters(['thisTripItineraryGrouped'])
  },
  data: function () {
    return {
      lbds: ["Su","M","T","W","Th","F","S"],
      lbts: ["H","M","S"],
      newEntryDate: '',
      newEntryText: '',
      icons: {
        upArrowIcon: true,
        downArrowIcon: false,
      },
      collapseClass: false,
      showNewDay: false,

showEditDate: false,
      showDeleteDate: false,
thisDate: "",
dateDocIDs: [],
timeMapIDs: {},

thisEntry: {},
      showUpdateItem: false,

      showDeleteItem: false,
thisItemID: '',

      showGroupGear: true,     
      

      addGearTitle: "",
      addGearCat: ""
    };
  },
  methods: {
    // UX
  toggleDate(e) {
      var content = e.target.parentNode.nextElementSibling;
      if (content.classList.contains("collapse")) {
        content.classList.remove("collapse");
      } else {
        content.classList.add("collapse");
      }
      // TODO this messes up expand all buttton, no class?
      e.target.classList.toggle("downArrowIcon");
      e.target.classList.toggle("upArrowIcon");
    },
    
    expandAllCategories() {
      // for every wrapper, add the class if it's missing from previous function :/ this could be much better
      let els = document.getElementsByClassName("collapseWrapper");
      for (let i = 0; i < els.length; i++) {
        if (els[i].classList) {
          if (els[i].classList.contains("collapse")) {
            console.log("collapse get out");
            els[i].classList.remove("collapse");
            els[i].previousElementSibling.children[0].classList.replace(
              "downArrowIcon",
              "upArrowIcon"
            );
          }
        }
      }
      this.collapseClass = false;
      this.icons = { upArrowIcon: true, downArrowIcon: false };
    },
    collapseAllCategories() {
      this.collapseClass = true;
      this.icons = { upArrowIcon: false, downArrowIcon: true };
    },

   // ITINERARY ENTRIES
    toggleUpdateItem(item) {
      this.showUpdateItem = !this.showUpdateItem;
      this.thisEntry = item;
    },
   
    deleteItem: function (itemID) {  
      this.thisItemID = itemID;    
      this.showDeleteItem = !this.showDeleteItem
    },
     toggleNewEntry() {
      this.showNewDay = !this.showNewDay
    },
    newEntry: function() {
      if(!this.newEntryText) {
        this.$toasted.show("Please add a description.")
        return
      }
      if (!this.newEntryDate) {
        this.$toasted.show("Please add a date and time.")
        return
      }
      let data = {
        tid: this.thisTrip.id,
        date: new Date(Date.parse(this.newEntryDate)),
        items: this.newEntryText
      };
      
      // Add new date to tripDates
      this.$store.dispatch('addItinEntry', data).then(() => {
        this.$emit("close");
        this.newEntryText=''
        this.newEntryDate=''
       this.$toasted.show('Entry added!')
      }).catch(e => {
        console.log(e)
        this.$toasted.show(e.message)
      })
    },
    toggleEditDate: function (date) {
      this.thisDate = date;
      var elementProm = []
      // gather all the doc ids to edit
      var ids = document.getElementById(date).parentNode.nextElementSibling.getElementsByClassName("lead")
      var idsMap = []
      for (let i = 0; i < ids.length; i++) {
        elementProm.push(new Promise((resolve) => {
          idsMap[ids[i].id] = ids[i].textContent
          resolve()
          }))        
      }
      console.log(idsMap)
      Promise.all(elementProm).then(() => {
        console.log('then')
         this.timeMapIDs = idsMap;
      this.showEditDate = !this.showEditDate;
      })
      
    },
    toggleDeleteDate: function (date) {
      this.thisDate = date;
      var elementProm = []
      // gather all the doc ids to trash
      var ids = document.getElementById(date).parentNode.nextElementSibling.getElementsByClassName("lead")
      var idsArray = []
      for (let i = 0; i < ids.length; i++) {
        elementProm.push(new Promise((resolve) => {
          idsArray.push(ids[i].id)
          resolve()
          }))        
      }
      console.log(idsArray)
      Promise.all(elementProm).then(() => {
        console.log('then')
         this.dateDocIDs = idsArray;
      this.showDeleteDate = !this.showDeleteDate;
      })
     
    }
  },
};
</script>

<style scoped>
/* vanilla css */
/* @import "../../../node_modules/vue-vanilla-datetime-picker/dist/DateTimePicker.css"; */
 /* livelybone css */
@import "../../../node_modules/@livelybone/vue-datepicker/lib/css/index.css";
input[type="checkbox"]:checked + label.strikethrough {
  text-decoration: line-through;
}
h4 {
  margin: 0;
  padding: 0;
  font-size: 1.2rem;
}
/* Main Content */
.gridWrapper {
  /* padding: 15px; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
  padding: 10px 0 0 10px;
}
.actionRow > p {
  margin-left: 10px;
  font-size: 1rem;
}

.actionRowPlaceholder {
  flex: 1;
}

.deleteIcon {
  /* background: url("../../assets/delete.svg") no-repeat center center; */
  /* background-size: contain; */
  width: 22px;
  height: 22px;
  cursor: pointer;
  /* vertical-align: middle; */
  /* padding: 12px; */
  display: inline-block;
}
.editIcon {
  /* background: url("../../assets/edit.svg") no-repeat center center; */
  /* background-size: contain; */
  width: 22px;
  height: 22px;
  cursor: pointer;
  /* vertical-align: middle; */
  /* margin-left: 20px; */

  /* padding: 0 9px 9px 9px; */
  display: inline-block;
}
.plusHide {
  display: none;
}
.plusShow {
  display: inline-block;
}
.collapse {
  display: none;
}
.downArrowIcon {
  background: url("../../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: black;
  transform: rotate(90deg); /*TODO in gimp*/
  cursor: pointer;
}
.upArrowIcon {
  background: url("../../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: black;
  transform: rotate(270deg); /*TODO in gimp*/
  cursor: pointer;
}
.leftArrowIcon {
  background: url("../../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: black;
  transform: rotate(180deg); /*TODO in gimp*/
  cursor: pointer;
}
.rightArrowIcon {
  background: url("../../assets/rightArrow.svg") no-repeat center center;
  background-size: contain;
  width: 15px;
  height: 15px;
  color: gray;
}

/* messages section */
#messages {
  margin-top: 15px;
}

.cell {
  padding: 0 10px;
}
.camperCell {
  padding-left: 10px;
  font-size: 0.8rem;
  color: rgb(65, 65, 65);
  font-style: italic;
  /* display: inline-block; */
}
.text {
  text-decoration: underline;
}
.categoryMenu {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}
.categoryMenu > a {
  padding: 5px;
  color: #7591db;
  font-size: 0.8rem;
}
.categoryButtons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}
.category {
  font-size: 0.8rem;
  color: gray;
}
.addSection {
  margin: 20px 0;
}
.highlightGear {
  box-shadow: 0px 0px 15px 4px #23df7f;
}
.gearPages {
  border-radius: 2px;
  padding: 10px;
  margin: 10px;
  cursor: pointer;
  border: 1px solid #bcbcbc;
}
.displayGear {
  display: block;
}
.hideGear {
  display: none;
}
.categoryGrid {
  /* display: flex;
  flex-direction: row;
  flex-wrap: wrap; */

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* justify-content: center; */
  justify-content: space-around;
}
.categoryBlock {
  /* width: 50%; */
  padding: 0 10px;
}
.categoryHeader {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.categoryHeader > .editIcon {
  margin: 0;
}
.categoryTitle {
  font-size: 1.3rem;
  padding: 15px 5px;
}
.itemTitle {
  font-size: 1.2rem;
}
.item {
  /* line-height: 1.6rem; */
  /* margin: 5px 0; */
  font-family: "Kalam", cursive;
  text-align: left;
  display: flex;
  align-items: center;
}

.lead {
  font-style: normal;
  font-weight: bold;
  padding-right: 20px;
}
.rowStyle {
  justify-content: center;
  align-items: center;
  margin: 10px 0;
}

</style>