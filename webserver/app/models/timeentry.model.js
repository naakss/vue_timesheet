module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
          date: String,
          startTime: String,
          break: String,
          endTime: String,
          total: String,
          customer: String,
          project: String,
          workDetails: String
        },
        { timestamps: true }
      );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
  
    const Timeentry = mongoose.model("timeentry", schema);
    return Timeentry;
  };