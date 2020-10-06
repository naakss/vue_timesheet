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
                <span class="headline">Edit Item</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field readonly v-model="editedItem.date" label="Date"></v-text-field>
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
                <v-btn class="mr-2" depressed color="primary" @click="close">Cancel</v-btn>
                <v-btn depressed color="primary" @click="save">Save</v-btn>
              </v-card-actions>

            </v-card>
          </v-dialog>

          <v-dialog v-model="clearDialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">Clear Item</span>
              </v-card-title>

              <v-card-text>
                Are you sure to clear the selected item?
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="mr-2" depressed color="primary" @click="closeClearDialog">No</v-btn>
                <v-btn depressed color="primary" @click="clearSelectedItem">Yes</v-btn>
              </v-card-actions>

            </v-card>
          </v-dialog>

        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn class="mr-2" depressed color="primary" @click="editItem(item)">Edit</v-btn>
        <v-btn depressed color="error" @click="setClearedItem(item)">Clear</v-btn>
      </template>

    </v-data-table>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "TimesheetTable",

  data: () => ({
    entries: [],
    search: "",
    dialog: false,
    clearDialog: false,
    headers: [
      { text: "Date", value: "date" },
      { text: "Start Time", value: "startTime", sortable: false },
      { text: "Break", value: "break", sortable: false },
      { text: "End Time", value: "endTime", sortable: false },
      { text: "Total", value: "total", sortable: false },
      { text: "Customer", value: "customer" },
      { text: "Project", value: "project" },
      { text: "Work Details", value: "workDetails", sortable: false },
      { text: "Actions", value: "actions", sortable: false, align: "center" },
    ],
    editedItem: {
      date: "",
      startTime: "",
      break: "",
      endTime: "",
      total: "",
      customer: "",
      project: "",
      workDetails: "",
      createdAt: "",
      updatedAt: "",
      id: "",
    },
    clearedItem: {
      date: "",
      startTime: "",
      break: "",
      endTime: "",
      total: "",
      customer: "",
      project: "",
      workDetails: "",
      createdAt: "",
      updatedAt: "",
      id: "",
    },
  }),

  mounted() {
    axios
      .get("http://localhost:8085/api/timeentries")
      .then((response) => {
        this.entries = response.data;
      })
      .catch((error) => console.log(error));
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  methods: {
    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    setClearedItem(item) {
      this.clearedItem.date = item.date;
      this.clearedItem.id = item.id;
      this.clearedItem.createdAt = item.createdAt;
      this.clearedItem.updatedAt = item.updatedAt;
      this.clearDialog = true;
    },

    updateEntries() {
      axios
            .get("http://localhost:8085/api/timeentries")
            .then((response) => {
              this.entries = response.data;
            })
            .catch((error) => console.log(error));
    },

    clearSelectedItem() {
      axios
        .put("http://localhost:8085/api/timeentries/" + this.clearedItem.id, this.clearedItem)
        .then(() => {
          this.updateEntries();
        })
        .catch((error) => console.log(error));
      this.clearDialog = false;
    },

    close() {
      this.dialog = false;
    },

    closeClearDialog() {
      this.clearDialog = false;
    },

    save() {
      axios
        .put("http://localhost:8085/api/timeentries/" + this.editedItem.id, this.editedItem)
        .then(() => {
          this.updateEntries();
        })
        .catch((error) => console.log(error));
      this.close();
    },
  },
};
</script>
