const db = require("../models");
const Timeentry = db.timeentries;

// Create and Save a new Timeentry
exports.create = (req, res) => {
  // Validate request
  if (!req.body.date) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Timeentry
  const timeentry = new Timeentry({
    date: req.body.date,
    startTime: req.body.startTime,
    break: req.body.break,
    endTime: req.body.endTime,
    total: req.body.total,
    customer: req.body.customer,
    project: req.body.project,
    workDetails: req.body.workDetails
  });

  // Save Timeentry in the database
  timeentry
    .save(timeentry)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Timeentry."
      });
    });
};

// Retrieve all Timeentries from the database.
exports.findAll = async (req, res) => {
  const customer = req.query.customer;
  var condition = customer ? { customer: { $regex: new RegExp(customer), $options: "i" } } : {};

  await Timeentry.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving all Timeentries from the database."
      });
    });
};

// Retrieve current week with current date
exports.findCurrentWeek = async (req, res) => {
  let currentDate = new Date();
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);

  let firstWeekDay = new Date(currentDate.getTime() - (86400000 * currentDate.getDay())); // 1 day = 86400000 millisecs
  let lastWeekDay = new Date(firstWeekDay.getTime() + (86400000 * 6));

  // Check if week date exists in database
  for (let i = 0; i < 7; i++) {

    let weekdate = new Date(firstWeekDay.getTime() + (86400000 * i));

    await Timeentry.find({
      date: {
        $eq: weekdate
      }
    }).then(data => {
      let timeentry = data;

      // add default entry if week day doesnt exist
      if (timeentry.length == 0) {
        let defaultEntry = new Timeentry({
          date: weekdate,
          startTime: "",
          break: "",
          endTime: "",
          total: "",
          customer: "",
          project: "",
          workDetails: ""
        });

        defaultEntry
          .save()
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Timeentry."
            });
          });
      }
    })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while checking if week day exists in database"
        });
      });
  }

  // return week data
  await Timeentry.find({
    date: {
      $gte: firstWeekDay,
      $lte: lastWeekDay
    }
  }).then(data => {
    res.send(data);
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while returning week data."
      });
    });
};

// Retrieve month entries with current month
exports.monthEntries = async (req, res) => {
  const month = req.params.month;
  const year = req.params.year;

  var currentDate = new Date();
  currentDate.setMonth(month);
  currentDate.setFullYear(year);
  var firstMonthDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  var lastMonthDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Set the 1st date of the month
  currentDate.setDate(1);

  while (currentDate.getMonth() == month) {

    // add default entry if day doesnt exist
    await Timeentry.find({
      date: currentDate.toDateString()
    }).then(data => {
      let timeentry = data;
      if (timeentry.length == 0) {

        let defaultEntry = new Timeentry({
          date: currentDate.toDateString(),
          startTime: "",
          break: "",
          endTime: "",
          total: "",
          customer: "",
          project: "",
          workDetails: ""
        });

        defaultEntry
          .save()
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Timeentry."
            });
          });
      }
    })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while checking if week day exists in database"
        });
      });

      currentDate.setTime(currentDate.getTime() + 86400000);
  }

  // return month data
  await Timeentry.find({
    date: {
      $gte: firstMonthDay.toDateString(),
      $lte: lastMonthDay.toDateString()
    }
  }).then(data => {
    res.send(data);
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while returning week data."
      });
    });
};

// Update a Timeentry by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Timeentry.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Timeentry with id=${id}. Maybe Timeentry was not found!`
        });
      } else res.send({ message: "Timeentry was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Timeentry with id=" + id
      });
    });
};

// Delete a Timeentry with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Timeentry.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Timeentry with id=${id}. Maybe Timeentry was not found!`
        });
      } else {
        res.send({
          message: "Timeentry was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Timeentry with id=" + id
      });
    });
};

// Delete all Timeentrys from the database.
exports.deleteAll = (req, res) => {
  Timeentry.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Timeentries were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};
