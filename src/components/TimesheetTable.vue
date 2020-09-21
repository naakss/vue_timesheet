<template>
  <v-app id="inspire">
    <v-data-table
      :headers="headers"
      :items="entries"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Employee name</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >New Item</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.date" label="Date"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.startTime" label="Start Time"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.break" label="Break"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.endTime" label="End Time"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.total" label="Total"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.customer" label="Customer"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.project" label="Project"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.workDetails" label="Work Details"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </v-app>
</template>

<script>
export default {
  name: "TimesheetTable",

  data: () => ({
    dialog: false,
    headers: [
      { text: 'Date', value: 'date' },
      { text: 'Start Time', value: 'startTime' },
      { text: 'Break', value: 'break' },
      { text: 'End Time', value: 'endTime' },
      { text: 'Total', value: 'total' },
      { text: 'Customer', value: 'customer' },
      { text: 'Project', value: 'project' },
      { text: 'Work Details', value: 'workDetails' },
      { text: '', value: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      date: '01 September 2020',
      startTime: '9:00',
      break: '1:00',
      endTime: '18:00',
      total: '8:00',
      customer: '',
      project: '',
      workDetails: ''
    },
    defaultItem: {
      date: '01 September 2020',
      startTime: '8:00',
      break: '1:00',
      endTime: '18:00',
      total: '8:00',
      customer: '',
      project: '',
      workDetails: ''
    },
    clearedItem: {
      date: '',
      startTime: '0:00',
      break: '0:00',
      endTime: '0:00',
      total: '0:00',
      customer: '',
      project: '',
      workDetails: ''
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.entries = [
        {
          date: '01 September 2020',
          startTime: '9:00',
          break: '1:00',
          endTime: '18:00',
          total: '8:00',
          customer: 'GuF',
          project: 'XYZ',
          workDetails: 'ABC'
        },
        {
          date: '02 September 2020',
          startTime: '9:00',
          break: '1:00',
          endTime: '18:00',
          total: '8:00',
          customer: 'GuF',
          project: 'XYZ',
          workDetails: 'ABC'
        },
        {
          date: '03 September 2020',
          startTime: '9:00',
          break: '1:00',
          endTime: '18:00',
          total: '8:00',
          customer: 'GuF',
          project: 'XYZ',
          workDetails: 'ABC'
        },
        {
          date: '04 September 2020',
          startTime: '9:00',
          break: '1:00',
          endTime: '18:00',
          total: '8:00',
          customer: 'GuF',
          project: 'XYZ',
          workDetails: 'ABC'
        },
        {
          date: '05 September 2020',
          startTime: '9:00',
          break: '1:00',
          endTime: '18:00',
          total: '8:00',
          customer: 'GuF',
          project: 'XYZ',
          workDetails: 'ABC'
        },
        {
          date: '06 September 2020',
          startTime: '9:00',
          break: '1:00',
          endTime: '18:00',
          total: '8:00',
          customer: 'GuF',
          project: 'XYZ',
          workDetails: 'ABC'
        },
        {
          date: '07 September 2020',
          startTime: '9:00',
          break: '1:00',
          endTime: '18:00',
          total: '8:00',
          customer: 'GuF',
          project: 'XYZ',
          workDetails: 'ABC'
        },
        {
          date: '08 September 2020',
          startTime: '9:00',
          break: '1:00',
          endTime: '18:00',
          total: '8:00',
          customer: 'GuF',
          project: 'XYZ',
          workDetails: 'ABC'
        },
        {
          date: '09 September 2020',
          startTime: '9:00',
          break: '1:00',
          endTime: '18:00',
          total: '8:00',
          customer: 'GuF',
          project: 'XYZ',
          workDetails: 'ABC'
        },
      ]
    },

    editItem (item) {
      this.editedIndex = this.entries.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      Object.assign(this.entries[this.entries.indexOf(item)], this.clearedItem)
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.entries[this.editedIndex], this.editedItem)
      } else {
        this.entries.push(this.editedItem)
      }
      this.close()
    },
  },
};
</script>
