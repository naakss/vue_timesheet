<template>
  <v-app id="inspire">
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Item</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  readonly
                  v-model="editedItem.date"
                  label="Date"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-select
                  :items="workTime"
                  v-model="editedItem.startTime"
                  label="Start Time"
                  v-on:change="calculateTotalTime"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  :items="breakTime"
                  v-model="editedItem.break"
                  label="Break"
                  v-on:change="calculateTotalTime"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  :items="workTime"
                  v-model="editedItem.endTime"
                  label="End Time"
                  v-on:change="calculateTotalTime"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  readonly
                  v-model="editedItem.total"
                  label="Total"
                  :rules="[rules.required, rules.timeValidity]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-select
                  :items="customers"
                  v-model="editedItem.customer"
                  label="Customer"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  :items="projects"
                  v-model="editedItem.project"
                  label="Project"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.workDetails"
                  label="Work Details"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-2" depressed color="primary" @click="close"
            >Cancel</v-btn
          >
          <v-btn depressed color="primary" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="clearDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Clear Item</span>
        </v-card-title>

        <v-card-text>Are you sure to clear the selected item?</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="mr-2"
            depressed
            color="primary"
            @click="closeClearDialog"
            >No</v-btn
          >
          <v-btn depressed color="primary" @click="clearSelectedItem"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-data-table
      id="ta2"
      :headers="headers"
      :items="entries"
      :items-per-page="entries.length"
      :item-class="highlightCurrentDateRow"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-btn depressed color="primary" @click="createPdf">Create PDF</v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.date="{ item }">
        {{ new Date(item.date).toDateString() }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn class="mr-2" depressed color="primary" @click="editItem(item)"
          >Edit</v-btn
        >
        <v-btn depressed color="error" @click="setClearedItem(item)"
          >Clear</v-btn
        >
      </template>
    </v-data-table>

    <v-container no-gutters>
      <v-row>
        <v-col>
        <v-btn class="mr-2" depressed color="primary" @click="viewPreviousMonth"
          >Previous Month</v-btn
        >
        <v-btn depressed color="primary" @click="viewNextMonth"
          >Next Month</v-btn
        >
        </v-col>
        </v-row>
      </v-container>
  </v-app>
</template>

<style>
@import "../assets/css/styles.css";
</style>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  name: "TimesheetTable",

  data: () => ({
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    workTime: [
      "04:00",
      "04:15",
      "04:30",
      "04:45",
      "05:00",
      "05:15",
      "05:30",
      "05:45",
      "06:00",
      "06:15",
      "06:30",
      "06:45",
      "07:00",
      "07:15",
      "07:30",
      "07:45",
      "08:00",
      "08:15",
      "08:30",
      "08:45",
      "09:00",
      "09:15",
      "09:30",
      "09:45",
      "10:00",
      "10:15",
      "10:30",
      "10:45",
      "11:00",
      "11:15",
      "11:30",
      "11:45",
      "12:00",
      "12:15",
      "12:30",
      "12:45",
      "13:00",
      "13:15",
      "13:30",
      "13:45",
      "14:00",
      "14:15",
      "14:30",
      "14:45",
      "15:00",
      "15:15",
      "15:30",
      "15:45",
      "16:00",
      "16:15",
      "16:30",
      "16:45",
      "17:00",
      "17:15",
      "17:30",
      "17:45",
      "18:00",
      "18:15",
      "18:30",
      "18:45",
      "19:00",
      "19:15",
      "19:30",
      "19:45",
      "20:00",
      "20:15",
      "20:30",
      "20:45",
      "21:00",
    ],
    breakTime: [
      "00:00",
      "00:15",
      "00:30",
      "00:45",
      "01:00",
      "01:15",
      "01:30",
      "01:45",
      "02:00",
      "02:15",
      "02:30",
      "02:45",
      "03:00",
    ],
    rules: {
      required: (value) => !!value || "Required field.",
      timeValidity: (value) => {
        const pattern = /^([01]\d|2[0-3]):?([0-5]\d)$/;
        return pattern.test(value) || "Invalid";
      },
    },
    entries: [],
    dialog: false,
    customers: ["BMW", "Audi", "Daimler"],
    projects: ["Can tool", "Infotainment", "MQTT", "Cloud"],
    clearDialog: false,
    headerArray: [["Date", "Total", "Customer", "Project", "Work Details"]],
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
    this.updateEntries();
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  methods: {
    viewNextMonth() {
      if (this.currentMonth == 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.updateEntries();
    },
    viewPreviousMonth() {
      if (this.currentMonth == 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.updateEntries();
    },
    highlightCurrentDateRow: function (item) {
      return new Date(item.date).getDate() === new Date().getDate() && new Date(item.date).getMonth() === new Date().getMonth() && new Date(item.date).getFullYear() === new Date().getFullYear()
        ? "lightblue-color"
        : "white-color";
    },
    pad_with_zeroes(number, length) {
      var str = "" + number;
      while (str.length < length) {
        str = "0" + str;
      }
      return str;
    },
    calculateTotalTime() {
      if (
        this.editedItem.startTime == "" ||
        this.editedItem.break == "" ||
        this.editedItem.endTime == ""
      )
        return;

      var startTimeMinutes =
        parseInt(this.editedItem.startTime.substring(3, 5)) +
        parseInt(this.editedItem.startTime.substring(0, 2)) * 60;
      var breakTimeMinutes =
        parseInt(this.editedItem.break.substring(3, 5)) +
        parseInt(this.editedItem.break.substring(0, 2)) * 60;
      var endTimeMinutes =
        parseInt(this.editedItem.endTime.substring(3, 5)) +
        parseInt(this.editedItem.endTime.substring(0, 2)) * 60;

      var totalTimeMinutes =
        endTimeMinutes - breakTimeMinutes - startTimeMinutes;
      var totalTimeHours = Math.floor(totalTimeMinutes / 60);
      if (totalTimeHours < 0) {
        this.editedItem.total = "--:--";
        return;
      }
      totalTimeMinutes = totalTimeMinutes % 60;
      this.editedItem.total =
        this.pad_with_zeroes(totalTimeHours, 2) +
        ":" +
        this.pad_with_zeroes(totalTimeMinutes, 2);
    },
    getPdfEntries() {
      var tableEntries = [];
      for (var i = 0; i < this.entries.length; i++) {
        var item = [];
        item.push(new Date(this.entries[i].date).toDateString());
        item.push(this.entries[i].total);
        item.push(this.entries[i].customer);
        item.push(this.entries[i].project);
        item.push(this.entries[i].workDetails);
        tableEntries.push(item);
      }
      return tableEntries;
    },

    createPdf() {
      var doc = new jsPDF();
      // var totalPagesExp = "{total_pages_count_string}";

      doc.autoTable({
        head: this.headerArray,
        body: this.getPdfEntries(),
        columnStyles: {
          0: { minCellWidth: 35 },
          1: { minCellWidth: 15 },
          2: { minCellWidth: 25 },
          3: { minCellWidth: 25 },
          4: { minCellWidth: 25 },
        },
        didDrawPage: function (data) {
          // Header
          doc.setFontSize(10);
          doc.text("e-GITS GmbH", 14, 10);
          doc.text("Meitnerstr. 9", 14, 16);
          doc.text("D-70563 Stuttgart", 14, 22);
          doc.text("Tel:   +49 (0) 711/9937 9090", 60, 10);
          doc.text("Fax:   +49 (0) 711/9937 9094", 60, 16);
          doc.text("Email: info@e-gits.com", 60, 22);

          var base64Img =
            "data:image/png;base64,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";
          if (base64Img) {
            doc.addImage(base64Img, "PNG", 155, 7, 40, 10);
          }
          doc.rect(
            data.settings.margin.left,
            25,
            doc.internal.pageSize.width - 28,
            0.2,
            "F"
          );

          // Footer
          var str = "Page " + doc.internal.getNumberOfPages();
          // Total page number plugin only available in jspdf v1.0+
          // if (typeof doc.putTotalPages === "function") {
          //  str = str + " of " + totalPagesExp;
          // }
          doc.setFontSize(10);
          doc.rect(
            data.settings.margin.left,
            doc.internal.pageSize.height - 15,
            doc.internal.pageSize.width - 28,
            0.2,
            "F"
          );

          // jsPDF 1.4+ uses getWidth, <1.4 uses .width
          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          doc.text(str, data.settings.margin.left, pageHeight - 10);
        },
        margin: { top: 30 },
      });
      doc.save("table.pdf");
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.editedItem.date = new Date(item.date).toDateString();
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
        .get("http://localhost:8085/api/timeentries/monthEntries/"+ this.currentMonth + "/" + this.currentYear)
        .then((response) => {
          this.entries = response.data;
        })
        .catch((error) => console.log(error));
    },

    clearSelectedItem() {
      axios
        .put(
          "http://localhost:8085/api/timeentries/" + this.clearedItem.id,
          this.clearedItem
        )
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
        .put(
          "http://localhost:8085/api/timeentries/" + this.editedItem.id,
          this.editedItem
        )
        .then(() => {
          this.updateEntries();
        })
        .catch((error) => console.log(error));
      this.close();
    },
  },
};
</script>
