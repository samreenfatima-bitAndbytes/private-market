var jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

const { CONST } = require("../helpers/constant");

module.exports = {
  setResponseObject: async (
    req,
    success,
    message,
    data,
    totalCount,
    currentPage,
    pageLimit
  ) => {
    let resp = {
      success: success,
    };
    if (message) {
      resp["message"] = message;
    }
    if (data) {
      resp["data"] = data;
    }
    if (totalCount) {
      let _pages = {
        totalCount: parseInt(totalCount),
        pageCount: Math.ceil(
          totalCount / parseInt(pageLimit) || parseInt(CONST.PAGE_LIMIT)
        ),
        currentPage: parseInt(currentPage) || parseInt(CONST.PAGE_NO),
        perPage: parseInt(pageLimit) || parseInt(CONST.PAGE_LIMIT),
      };
      resp["_meta"] = _pages;
    }

    resp.copyrighths = "Hotopics Unipessoal Lda";
    resp.dateChecked = "";
    req.newRespData = await resp;
    return;
  },

  setEmptyResponseObject: async (
    req,
    success,
    message,
    data,
    totalCount,
    currentPage,
    pageLimit
  ) => {
    let resp = {
      success: success,
    };
    if (message) {
      resp["message"] = message;
    }
    if (data) {
      resp["data"] = data;
    }
    if (totalCount==0) {
      let _pages = {
        totalCount: parseInt(totalCount),
        pageCount:  0,
        currentPage: parseInt(currentPage) || parseInt(CONST.PAGE_NO),
        perPage: parseInt(pageLimit) || parseInt(CONST.PAGE_LIMIT),
      };
      resp["_meta"] = _pages;
    }

    resp.copyrighths = "Hotopics Unipessoal Lda";
    resp.dateChecked = "";
    req.newRespData = await resp;
    return;
  },

  getDateFromObj: async (date) => {
    var date = new Date(date);
    var day = date.getDate(); //Date of the month: 2 in our example
    var month = date.getMonth(); //Month of the Year: 0-based index, so 1 in our example
    var year = date.getFullYear();
    return day + "/" + month + "/" + year;
  },

  getOTP() {
    var otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  },

  getHashPassword: (password) => {
    let pwd = bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    return pwd;
  },

  comparePasswords: async (plainTextPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    // Return true or false based on whether the plain text and hashed password match
    return isMatch;
  },
  generateToken: async (userId, email, deviceId, deviceType) => {
    const tokenData = {
      userId: userId,
      email: email,
      deviceId: deviceId,
      deviceType: deviceType,
    };
    return await jwt.sign(tokenData, process.env.JWT_SECRET || "Development", {
      expiresIn: "1d",
    });
  },

  generateOTP: () => {
    var result = Math.floor(1000 + Math.random() * 9000);
    return result;
  },

  getRandomName(max) {
    let randomNames = ["John", "Sally", "Alex", "Kristen", "Nicholas", "Sandy"];
    return randomNames[Math.floor(Math.random() * max)];
  },

  getRandomEmail(max) {
    let emailNames = ["abc", "xyz", "hello", "zero", "happy", "Qwer"];
    return emailNames[Math.floor(Math.random() * max)];
  },

  getOtpExpireTime: (minutes) => {
    let currentTime = new Date().getTime();
    return new Date(currentTime + parseInt(minutes) * 60 * 1000);
  },

  generateAflaNumricCode: (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ~!@#$%^&*()_+?";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  convertStringtoArray: (str) => {
    let string = [];
    function splitStr(str) {
      string = str.split(",");
    }
    splitStr(str);
    return string;
  },

  validateObjectId: (userId) => {
    if (userId && userId != "" && isValidObjectId(userId)) {
      return true;
    } else return false;
  },

  validateEmail: (email) => {
    var regExp = /^[A-Za-z][\w$.]+@[\w]+\.\w+$/;
    if (regExp.test(email)) return true;
    else return false;
  },

  validatePhone: (phone) => {
    if (phone.length < 3) return false;
    let regExp =
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    if (regExp.test(phone)) return true;
    else return false;
  },

  validatePassword: (password) => {
    // var regExp = ^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$;
    var regExp = /^(?=.*\p{Ll})(?=.*\p{Lu})[\p{L}\d@#$!%*?&]{8,15}$/gmu;
    if (regExp.test(password)) return true;
    else return false;
  },

  restrictAlpha: (e) => {
    console.log("e => ", e);
    const re = /^[a-zA-Z0-9\s]*$/;
    if (re.test(e)) return false;
    else return true;
  },
};
