const { default: mongoose } = require('mongoose');

let bucket;
(() => {
    mongoose.connection.on("connected", () => {
        bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: "filesBucket",
        });
    });
})();

module.exports = bucket;