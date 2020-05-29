module.exports = {
  createdBy: {
    type: String,
    default: 'admin'  // empid of creator
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: String
  },
  modifiedAt: {
    type: Date
  }
}