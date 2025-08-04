const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sheelukushwaha7:jempc4Orfcm7QL0N@clustersk.oyuxzux.mongodb.net/devTinder");
}

module.exports = connectDB;