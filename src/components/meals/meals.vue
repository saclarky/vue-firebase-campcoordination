<template>
  <div>
     <div class="content">
      <div v-if="thisTrip.group === true" class="gridWrapper">
        <div id="groupButton" :class="group" @click="toggleMealPage($event)">Group Meals</div>
        <div :class="groupArrow"></div>
        <div :class="myArrow"></div>
        <div id="myButton" :class="mine" @click="toggleMealPage($event)">My Meals</div>
      </div>
      <div v-if="thisTrip.group=== false">
        My Meals
      </div>

      <!-- MEALS VIEW -->
      <div>
        <div >  
           <button @click='toggleNewDay'>Add Meal</button>        
          <div class="categoryGrid">
           
            <div
              class="categoryBlock"
              v-for="(meals, date) in thisTripMealsCategorized"
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
              <!-- Display all meals for this date -->
              <!-- <div> wrapper is just for show/hide -->
              <div :class="{collapse: collapseClass, collapseWrapper: true}">      
                <div class="item" v-for="meal in thisTripMealsCategorized[date]" :key="meal.id">
                  <div class="lead" :id="meal.id">{{meal.mealType}}:</div>
                  <div>{{Array.isArray(meal.items) ? meal.items.join(', ') : ''}}</div>                 
                  <div
                    class="editIcon"
                    @click="toggleUpdateItem(meal)"
                  >
                    <svg width="22px" height="22px" viewbox="0 0 22 22">
                      <path
                        fill="#c0c0c0"
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    </svg>
                  </div>
                  <div class="deleteIcon" @click="deleteItem(meal.id)">
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
   
   <newMealDatesPopup v-if='showNewDay' @close='toggleNewDay' :tid="thisTrip.id" :page="whichPage"></newMealDatesPopup>
   <editMealDatesPopup v-if="showEditDate" @close='function() {showEditDate = !showEditDate;}' :date="thisDate" :page="whichPage" :tid="thisTrip.id" :docIDs="dateDocIDs"></editMealDatesPopup>
   <deleteMealDatesPopup v-if="showDeleteDate" @close='function() {showDeleteDate = !showDeleteDate;}' :date="thisDate" :page="whichPage" :tid="thisTrip.id" :docIDs="dateDocIDs"></deleteMealDatesPopup>
   <updateMealPopup v-if="showUpdateItem" @close='function() {showUpdateItem = !showUpdateItem;}' :meal="thisMeal" :page="whichPage" :tid="thisTrip.id" ></updateMealPopup>
  <deleteMealPopup v-if='showDeleteMeal' @close='function() {showDeleteMeal = !showDeleteMeal;}' :id="thisItemID" :tid="thisTrip.id" :page="whichPage"></deleteMealPopup>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import newMealDatesPopup from "./newMealDatesPopup";
import editMealDatesPopup from "./editMealDatesPopup";
import deleteMealDatesPopup from './deleteMealDatesPopup'
import updateMealPopup from './updateMealPopup'
import deleteMealPopup from './deleteMealPopup'

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
    newMealDatesPopup,
    editMealDatesPopup,
    deleteMealDatesPopup,
    updateMealPopup,
    deleteMealPopup
  },
  computed: {
    thisTripMealsCategorized: function() {
      if (this.whichPage === 'group') {
        return this.thisTripGroupMealsOrdered
      } 
      else {
        console.log('todo ind')
        return this.thisTripIndMealsOrdered
      }
    },
    group() {
      return {
        highlightGear: this.showGroupGear,
        gearPages: true,
      };
    },
    mine() {
      return {
        highlightGear: !this.showGroupGear,
        gearPages: true,
      };
    },
    groupArrow() {
      return {
        rightArrowIcon: this.showGroupGear,
      };
    },
    myArrow() {
      return {
        leftArrowIcon: !this.showGroupGear,
      };
    },
    ...mapState(["thisTrip", "userProfile"]),
    ...mapGetters([
      "thisTripGroupMealsOrdered", "thisTripIndMealsOrdered"
    ]),
  },
  data: function () {
    return {
      whichPage: "", // tell component if this is group gear or ind. page
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

thisMeal: {},
      showUpdateItem: false,

      showDeleteMeal: false,
thisItemID: '',

      showGroupGear: true,     
      

      addGearTitle: "",
      addGearCat: ""
    };
  },
  methods: {
    // UX
    toggleMealPage(event) {
      if ( (event.target.id === "groupButton" && this.showGroupGear === false)    ) {
        this.showGroupGear = !this.showGroupGear;
        this.whichPage = 'group'
      } else if ( (event.target.id === "myButton" && this.showGroupGear === true)) {
        this.showGroupGear = !this.showGroupGear;
        this.whichPage = 'ind'
      }
    },
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

    // MEALS
   
    toggleUpdateItem(item) {
      this.showUpdateItem = !this.showUpdateItem;
      this.thisMeal = item;
      // this.thisItemID = id;
      // this.thisItemTitle = title;
      // this.thisItemCat = cat;
      // this.thisCampers = campers;
    },
   
    deleteItem: function (itemID) {  
      this.thisItemID = itemID;    
      this.showDeleteMeal = !this.showDeleteMeal
    },
    updateGearItemStatus: function (item) {
      let data = {
        page: this.whichPage,
        id: item.target.value,
        status: item.target.checked,
      }
      this.$store.dispatch("updateStatusAction", data).catch(e => {
        this.$toasted.show(e.message)
      })
    },  

    // Dates
     toggleNewDay() {
      this.showNewDay = !this.showNewDay
    },
    toggleEditDate: function (date) {
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
  /* background: url("../assets/delete.svg") no-repeat center center; */
  /* background-size: contain; */
  width: 22px;
  height: 22px;
  cursor: pointer;
  /* vertical-align: middle; */
  /* padding: 12px; */
  display: inline-block;

  /* padding: 0 9px 9px 9px; */
}
.editIcon {
  /* background: url("../assets/edit.svg") no-repeat center center; */
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
</style>