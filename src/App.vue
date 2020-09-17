<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    </v-app-bar>

    <v-main>
      <TimesheetTable/>
    </v-main>
  </v-app>
</template>

<script>
import TimesheetTable from './components/TimesheetTable';

export default {
  name: 'App',

  components: {
    TimesheetTable,
  },

};
</script>
