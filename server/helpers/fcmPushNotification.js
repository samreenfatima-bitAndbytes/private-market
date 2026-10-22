/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const {
  USER_NOTIFICATION_MODEL,
} = require("../app/notification/model/notification.model");
const { CONST } = require("../helpers/constant");
var FCM = require("fcm-push");
const dotenv = require("dotenv");

dotenv.config();

const serverKey = process.env.FCM_SERVER_KEY;

module.exports = {
  sendNotification: (deviceTokens, title, body, description) => {
    var server_key = serverKey;
    var fcm = new FCM(server_key);

    var message = {
      to: deviceTokens,
      content_available: true,
      collapse_key: "your_collapse_key",
      data: {
        title: title,
        body: body,
        description: description,
      },
      notification: {
        title: title,
        body: body,
      },
    };
    fcm.send(message, function (err, response) {
      if (err) {
        console.log("notification error", err);
      } else {
        console.log("notification send successfully", response);
      }
    });
  },
};
