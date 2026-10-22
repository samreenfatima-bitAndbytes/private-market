const { GEOSEARCH } = require("../model/geosearch.model");
const { PROPERTY } = require("../../property/model/property.model");

class SearchController {
  async getgeosearch(req, res) {
    try {
      const query = req.query.query;
      const propertyType = req.query.propertyType;

      if (!query) {
        return res.status(400).json({ error: "Query parameter is missing" });
      }

      const results = await GEOSEARCH.find({
        $or: [
          { parish: { $regex: query, $options: 'i' } },
          { municipality: { $regex: query, $options: 'i' } },
          { district: { $regex: query, $options: 'i' } },
        ],
      }).limit(10);

      const addresses = await Promise.all(results.map(async (result) => {
        let matchField = null;
        let propertyCount = 0;

        const propertyConditions = {
          $and: [
            { parish: result.parish },
            { municipality: result.municipality },
            { district: result.district },
            { state: 1 },
          ]
        };

        if (propertyType) {
          propertyConditions.$and.push({ type_of_real_estate: propertyType });
        }

        propertyCount = await PROPERTY.countDocuments(propertyConditions);

        if (new RegExp(query, 'i').test(result.parish)) {
          matchField = 'parish';
        } else if (new RegExp(query, 'i').test(result.municipality)) {
          matchField = 'municipality';
        } else if (new RegExp(query, 'i').test(result.district)) {
          matchField = 'district';
        }

        return {
          ...result.toObject(),
          matchField,
          propertyCount,
        };
      }));

      const districts = [];
      const municipalities = [];

      for (const address of addresses) {
        if (address.municipality && address.district) {
          const propertyConditions = {
            $and: [
              { municipality: address.municipality },
              { district: address.district },
              { state: 1 },
            ]
          };

          if (propertyType) {
            propertyConditions.$and.push({ type_of_real_estate: propertyType });
          }

          const propertyCount = await PROPERTY.countDocuments(propertyConditions);
          municipalities.push({
            municipality: address.municipality,
            district: address.district,
            propertyCount
          });
        }

        if (address.district && !districts.some(d => d.district === address.district)) {
          const propertyConditions = {
            $and: [
              { district: address.district },
              { state: 1 },
            ]
          };

          if (propertyType) {
            propertyConditions.$and.push({ type_of_real_estate: propertyType });
          }

          const propertyCount = await PROPERTY.countDocuments(propertyConditions);
          districts.push({
            district: address.district,
            propertyCount
          });
        }
      }

      const uniqueMunicipalities = Array.from(
        new Set(municipalities.map(JSON.stringify))
      ).map(JSON.parse);

      const uniqueDistricts = Array.from(districts);

      const response = {
        addresses,
        municipalities: uniqueMunicipalities,
        districts: uniqueDistricts,
      };

      res.json(response);
    } catch (err) {
      console.error('Error:', err);  // Log error for debugging
      res.status(500).send(err.message);
    }
  }
}

module.exports = new SearchController();
