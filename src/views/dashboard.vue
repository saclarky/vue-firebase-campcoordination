<template>
    <div>
        <div>
        <div>Notifications</div>
        <!-- TODO filter responded, time frame etc -->
        <div v-for="alert in thisUserNotifications" :key="alert.id">
            <!-- from | time | category | message | actions/responded -->
          <span>
            {{alert.time}}
            -
            {{alert.text}}
          </span>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        created() {


  }
    }
</script>

<style scoped>

</style>