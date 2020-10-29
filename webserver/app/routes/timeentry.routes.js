module.exports = app => {
    const timeentries = require("../controllers/timeentry.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Time entry
    router.post("/", timeentries.create);
  
    // Retrieve all Time entries
    router.get("/", timeentries.findAll);
  
    // Retrieve entries over a date range
    router.get("/rangeEntries/:startDate/:endDate", timeentries.rangeEntries);

    // Retrieve entries over a date range and selected project
    router.get("/rangeProjectEntries/:startDate/:endDate/:project", timeentries.rangeProjectEntries);

    // Retrieve entries over a date range and selected customer
    router.get("/rangeCustomerEntries/:startDate/:endDate/:customer", timeentries.rangeCustomerEntries);

    // Retrieve entries over a date range, selected project and customer
    router.get("/rangeProjectCustomerEntries/:startDate/:endDate/:project/:customer", timeentries.rangeProjectCustomerEntries);

    // Retrieve month entries with month and year parameters
    router.get("/monthEntries/:month/:year", timeentries.monthEntries);
  
    // Update a Time entry with id
    router.put("/:id", timeentries.update);
  
    // Delete a Time entry with id
    router.delete("/:id", timeentries.delete);
  
    // Create a new Time entry
    router.delete("/", timeentries.deleteAll);
  
    app.use('/api/timeentries', router);
  };