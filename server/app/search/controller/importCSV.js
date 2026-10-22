const mongoose = require('mongoose');
const fs = require('fs');
const csvtojson = require("csvtojson");

const path = require('path');
// const Location = require('./Location'); // Adjust the path as needed
const { GEOSEARCH } = require("../model/geosearch.model");

// Connect to MongoDB
mongoose.connect('mongodb://privatemarkets-node-2059_db_1/privateMarkets', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        importCSV();
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

// Function to import CSV data
const importCSV = () => {
    const csvFilePath = path.join(__dirname, '../../../public', 'Portugal_Geo_Data.csv');

    csvtojson()
        .fromFile(csvFilePath)
        .then(async (jsonObj) => {
            try {
                // Save each JSON object to the database
                for (const item of jsonObj) {
                    const newLocation = new GEOSEARCH({
                        district: item.district,
                        municipality: item.municipality,
                        parish: item.parish,
                    });
                    saveLoc = await newLocation.save();
                    console.log(saveLoc)

                }
                console.log('CSV data imported successfully');
            } catch (err) {
                console.error('Error saving data:', err);
            } finally {
                mongoose.connection.close();
            }
        })
        .catch((err) => {
            console.error('Error converting CSV to JSON:', err);
        });


};
