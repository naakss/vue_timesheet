module.exports = app => {
    const timeentries = require("../controllers/timeentry.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Time entry
    router.post("/", timeentries.create);
  
    // Retrieve all Time entries
    router.get("/", timeentries.findAll);
  
    // Retrieve current week with current date
    router.get("/currentWeek", timeentries.findCurrentWeek);

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