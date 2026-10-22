/*
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let mongoose = require("mongoose");
let logger = require("winston");
const { CONST } = require("./constant.js");
const { DISTRICT } = require("../app/uploadData/models.js/district.model.js");
const { USER } = require("../app/userService/model/userModel.js");

const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(process.env.DB_URL);

async function createDistrict() {
  const districtArr = [
    {
      title: "Aveiro",
    },
    {
      title: "Beja",
    },
    {
      title: "Braga",
    },
    {
      title: "Bragança",
    },
    {
      title: "Castelo Branco",
    },
    {
      title: "Coimbra",
    },
    {
      title: "Évora",
    },
    {
      title: "Faro",
    },
    {
      title: "Guarda",
    },
    {
      title: "Leiria",
    },
    {
      title: "Lisboa",
    },
    {
      title: "Portalegre",
    },
    {
      title: "Porto",
    },
    {
      title: "Santarém",
    },
    {
      title: "Setúbal",
    },
    {
      title: "Viana do Castelo",
    },
    {
      title: "Vila Real",
    },
    {
      title: "Ilha da Madeira",
    },
    {
      title: "Ilha de Porto Santo",
    },
    {
      title: "Ilha de Santa Maria",
    },
    {
      title: "Ilha de São Miguel",
    },
    {
      title: "Ilha Terceira",
    },
    {
      title: "Ilha Graciosa",
    },
    {
      title: "Ilha de São Jorge",
    },
    {
      title: "Ilha do Pico",
    },
    {
      title: "Ilha das Flores",
    },
    {
      title: "Ilha do Corvo",
    },
  ];

  let user = await USER.findOne({ roleId: CONST.ADMIN });

  districtArr.forEach(async (element) => {
    const payload = {
      title: element.title,
      createdBy: user._id,
      stateId: CONST.ACTIVE,
    };

    const isExist = await DISTRICT.findOne({
      title: payload.title,
    });

    if (isExist) {
      logger.info(`${isExist.title} District  already created`);
    } else {
      const save = await DISTRICT(payload).save();
    }
  });

  logger.info("Successfully District created");
  //  process.exit();
}

createDistrict();
