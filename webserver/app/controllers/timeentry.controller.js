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
exports.findAll = (req, res) => {
    const customer = req.query.customer;
    var condition = customer ? { customer: { $regex: new RegExp(customer), $options: "i" } } : {};
  
    Timeentry.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
};

// Find a single Timeentry with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Timeentry.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Timeentry with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Timeentry with id=" + id });
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
