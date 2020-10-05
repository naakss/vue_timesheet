<template>
  <v-app id="inspire">
    <v-data-table
      :search="search"
      :headers="headers"
      :items="entries"
      sort-by="calories"
      class="elevation-1"
    >

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-spacer></v-spacer>

          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.date" label="Date"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field v-model="editedItem.startTime" label="Start Time"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field v-model="editedItem.break" label="Break"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field v-model="editedItem.endTime" label="End Time"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field v-model="editedItem.total" label="Total"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field v-model="editedItem.customer" label="Customer"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field v-model="editedItem.project" label="Project"></v-text-field>
                    </v-col>
                    <v-col cols="12">
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
        <v-btn class="mr-2" depressed color="primary" @click="editItem(item)">Edit</v-btn>
        <v-btn depressed color="error" @click="deleteItem(item)">Delete</v-btn>
      </template>
    </v-data-table>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: "TimesheetTable",

  data: () => ({
    entries: [],
    search: "",
    dialog: false,
    headers: [
      { text: "Date", value: "date" },
      { text: "Start Time", value: "startTime", sortable: false },
      { text: "Break", value: "break", sortable: false },
      { text: "End Time", value: "endTime", sortable: false },
      { text: "Total", value: "total", sortable: false },
      { text: "Customer", value: "customer" },
      { text: "Project", value: "project" },
      { text: "Work Details", value: "workDetails", sortable: false },
      { text: "Actions", value: "actions", sortable: false, align:"center" },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      date: "01 September 2020",
      startTime: "9:00",
      break: "1:00",
      endTime: "18:00",
      total: "8:00",
      customer: "",
      project: "",
      workDetails: "",
    },
    defaultItem: {
      date: "01 September 2020",
      startTime: "8:00",
      break: "1:00",
      endTime: "18:00",
      total: "8:00",
      customer: "",
      project: "",
      workDetails: "",
    },
    clearedItem: {
      date: "",
      startTime: "0:00",
      break: "0:00",
      endTime: "0:00",
      total: "0:00",
      customer: "",
      project: "",
      workDetails: "",
    },
  }),

  mounted () {
    axios
      .get('http://localhost:8085/api/timeentries')
      .then(response =>  {
        this.entries = response.data
      }
        )
      .catch(error => console.log(error))
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  methods: {

    editItem(item) {
      this.editedIndex = this.entries.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      Object.assign(this.entries[this.entries.indexOf(item)], this.clearedItem);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.entries[this.editedIndex], this.editedItem);
      } else {
        this.entries.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
