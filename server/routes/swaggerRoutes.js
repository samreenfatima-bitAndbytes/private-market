let expression = true;

module.exports = function (app) {
  /*Routes for authentication*/
  /*Login*/
  app.post("/auth/signin", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                                #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                               in: 'body',
                               description: 'Some description...',
                               schema: {
                                      $email: "",
                                      $password: "", 
                               }
                       } */

    if (expression) {
      // #swagger.responses[201] = { description: 'User SignIn Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /*SignUp*/
  app.post("/auth/signup", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                                #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                               in: 'body',
                               description: 'Some description...',
                                schema: {
                                      $firstName:"",
                                      $lastName:"",
                                      $email: "",
                                      $password: "",
                                      $gender:"0"
                               }
                       } */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Signup Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /*Forgot Email*/
  app.post("/auth/forgotPassword", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Otp has been send to your phone no.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /*Change Password*/
  app.put("/auth/changePassword", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $password: "",
                                  $oldPassword: "",
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Change Password Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /*Get Profile*/
  app.get("/auth/profile", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /*Edit Profile*/
  app.put("/auth/editProfile", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to edit user detail.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['profileImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'Select Images',
             } 

     
             #swagger.parameters['fullName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 
             }

               #swagger.parameters['companyName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'companyName',
                 
             }

             #swagger.parameters['firstName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 
             }

             #swagger.parameters['lastName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 
             }
     
             #swagger.parameters['mobile'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Mobile No.',     
             }

              #swagger.parameters['dob'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'dob',     
             }

              #swagger.parameters['gender'] = {
                 in: 'formData',
                 type: 'number',
                 description: '1',     
             }

              #swagger.parameters['longitude'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'longitude',
             }

              #swagger.parameters['latitude'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'latitude',
             }
     
             #swagger.parameters['countryCode'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Country Code',
             }

             #swagger.parameters['address'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'address',
             }

             #swagger.parameters['isNotificationOn'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'isNotificationOn',
             }
     
             #swagger.parameters['isAvailable'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Availability',
                 default: false,
             }

              #swagger.parameters['vehicleType'] = {
                 in: 'formData',
                 type: 'string',
                 description: '0-heavy,1-light',
                 
             }


         */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /*Verify Otp*/
  app.put("/auth/verifyOtp", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to signup a user.' */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $email: "",
                                  $otp:""
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Otp verified successfully' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /** resend OTP */
  app.put("/auth/resendOtp", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                        #swagger.description = 'Endpoint to resend Otp .' */

    /*  #swagger.parameters['obj'] = {
                       in: 'body',
                       description: 'Some description...',
                       schema: {
                              $email: ""
                              
                       }
               } */
    if (expression) {
      // #swagger.responses[201] = { description: 'Otp resend successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /** Logout */
  app.put("/auth/notifyMe", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                        #swagger.description = 'Endpoint to user logout.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Logout successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /*Get Image Based on Id*/
  app.get("/getImg/:fileId", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to get/download Image' */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /*Delete Image Based on Id*/
  app.delete("/delete/file/:fileId", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                            #swagger.description = 'Endpoint to delete Image' */
    if (expression) {
      // #swagger.responses[201] = { description: 'File deleted Successfully' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /** Logout */
  app.post("/auth/logout", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                        #swagger.description = 'Endpoint to user logout.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Logout successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /** Delete Account */
  app.put("/auth/deleteAccount", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['USER-AUTHENTICATION']
                        #swagger.description = 'Endpoint to user Delete Account.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Logout successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /**end */

  /*Routes for cms*/
  app.post("/admin/cms/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CMS']
                                    #swagger.description = 'Endpoint to add cms.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                                 in: 'body',
                                 title: 'Some description...',
                                 schema: {
                                        $title: "",
                                        $description: "",
                                        $typeId: 1
                
                                     }
                         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/cms/", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                                     #swagger.description = 'Endpoint to get csm list.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                               in: 'query',
                               description: 'Enter pageNo.'
                              }
                         */

    /* #swagger.parameters['pageLimit'] = {
                               in: 'query',
                               description: 'Enter pageLimit.'
                              }
                         */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/cms/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                                     #swagger.description = 'Endpoint to get single cms.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/cms/update/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                                     #swagger.description = 'Endpoint to update single cms.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                                 in: 'body',
                                 title: 'Some description...',
                                 schema: {
                                        $title: "",
                                        $description: "",
                                        $typeId: 1
                                     }
                         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/cms/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                                     #swagger.description = 'Endpoint to get single cms.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                                 in: 'body',
                                 title: 'Some description...',
                                 schema: {
                                        $stateId: 0
                
                                     }
                         } */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/cms/getByType", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                                     #swagger.description = 'Endpoint to get cms.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['typeId'] = {
                               in: 'query',
                               description: 'Enter typeId.'
                              }
                         */

    if (expression) {
      // #swagger.responses[201] = { description: 'CMS found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/cms/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CMS']
                                 #swagger.description = 'Endpoint to get delete cms.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for faq*/
  app.post("/admin/faq/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['FAQ']
                                #swagger.description = 'Endpoint to add faq.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                    $question: "",
                                    $answer: "",
                                 }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/faq/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to get faq list.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                           in: 'query',
                           description: 'Enter pageNo.'
                          }
                     */

    /* #swagger.parameters['pageLimit'] = {
                           in: 'query',
                           description: 'Enter pageLimit.'
                          }
                     */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/faq/detail/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to get single faq.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/faq/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to update single faq.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                             in: 'body',
                             title: 'Some description...',
                             schema: {
                                    $question: "",
                                    $answer: "",
                                    $stateId:"",
                                 }
                     } */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/faq/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to change faq state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/faq/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAQ']
                                 #swagger.description = 'Endpoint to delete faq.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'FAQ deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for user management*/
  app.put("/admin/user/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
                            #swagger.description = 'Endpoint to edit user for Admin and company.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['profileImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'Select Images',
             } 
  
            #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['email'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter email',
             } 

     
             #swagger.parameters['fullName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 
             }
    
             #swagger.parameters['firstName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 
             }
    
             #swagger.parameters['lastName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 
             }
  
             #swagger.parameters['roleId'] = {
                 in: 'formData',
                 type: 'number',
                 description: '2-USER',
             }
     
             #swagger.parameters['mobile'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Mobile No.',     
             }
              #swagger.parameters['longitude'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'longitude',
             }
    
              #swagger.parameters['latitude'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'latitude',
             }
     
             #swagger.parameters['countryCode'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'address',
             }
    
             #swagger.parameters['address'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'address',
             }
     
             #swagger.parameters['isAvailable'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Availability',
                 default: false,
             }
    
         */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/user/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
                            #swagger.description = 'Endpoint to edit user.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['profileImg'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'Select Images',
             } 
  

             #swagger.parameters['email'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter email',
             } 

     
             #swagger.parameters['fullName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 
             }
    
             #swagger.parameters['firstName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 
             }
    
             #swagger.parameters['lastName'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Name',
                 
             }
  
             #swagger.parameters['roleId'] = {
                 in: 'formData',
                 type: 'number',
                 description: '2-USER',
             }
     
             #swagger.parameters['mobile'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Mobile No.',     
             }
              #swagger.parameters['longitude'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'longitude',
             }
    
              #swagger.parameters['latitude'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'latitude',
             }
     
             #swagger.parameters['countryCode'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'address',
             }
    
             #swagger.parameters['address'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'address',
             }
     
             #swagger.parameters['isAvailable'] = {
                 in: 'formData',
                 type: 'boolean',
                 description: 'Availability',
                 default: false,
             }
    
         */

    if (expression) {
      // #swagger.responses[201] = { description: 'User Updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/user/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
                            #swagger.description = 'Endpoint to get  user list' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    /* #swagger.parameters['roleId'] = {
                         in: 'query',
                         description: 'Enter roleId.'
                        }
                   */

    /* #swagger.parameters['sorting'] = {
                         in: 'query',
                         description: 'Enter sorting.'
                        }
                   */

    /* #swagger.parameters['state'] = {
                         in: 'query',
                         description: 'Enter state.'
                        }
                   */

    /* #swagger.parameters['search'] = {
                         in: 'query',
                         description: 'Enter search.'
                        }
                   */

    /* #swagger.parameters['id'] = {
                         in: 'query',
                         description: 'Enter user Id.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'Users list found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/user/changeState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
                                     #swagger.description = 'Endpoint to  change State.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                $state: "",                                 
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/user/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['ADMIN']
                                     #swagger.description = 'Endpoint to get user detail.' 
                              */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/dashboard/count", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
                     #swagger.description = 'Endpoint to get  booking .' 
              */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/dashboard/graphData/:year", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['ADMIN']
                     #swagger.description = 'Endpoint to get  booking .' 
              */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for error list*/
  app.get("/admin/logs/errorList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGS']
                            #swagger.description = 'Endpoint to get Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/logs/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGS']
                            #swagger.description = 'Endpoint to delete Error logs' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/logs/deleteAll", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGS']
                            #swagger.description = 'Endpoint to delete Error logs' */
    /* #swagger.security = [{ "Bearer": [] }] */
    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for email*/
  app.get("/admin/emailLogs/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['EMAIL LOG']
                       #swagger.description = 'Endpoint to get email list.' 
                */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['state'] = {
                     in: 'query',
                     description: 'Enter state.'
                    }
               */

    /* #swagger.parameters['search'] = {
                     in: 'query',
                     description: 'Enter state.'
                    }
               */

    /* #swagger.parameters['typeId'] = {
                     in: 'query',
                     description: 'Enter typeId.'
                    }
               */

    /* #swagger.parameters['pageNo'] = {
                     in: 'query',
                     description: 'Enter pageNo.'
                    }
               */

    /* #swagger.parameters['pageLimit'] = {
                     in: 'query',
                     description: 'Enter pageLimit.'
                    }
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'email list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/emailLogs/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['EMAIL LOG']
                      #swagger.description = 'Endpoint to view email details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'email details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/emailLogs/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['EMAIL LOG']
                      #swagger.description = 'Endpoint to delete email.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Email delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/emailLogs/deleteAll", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['EMAIL LOG']
                          #swagger.description = 'Endpoint to delete email.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'Emails delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  /*Routes for login history*/
  app.get("/admin/loginActivity/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['LOGIN_HISTORY']
                                 #swagger.description = 'Endpoint to get login history.' 
                          */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                               in: 'query',
                               description: 'Enter pageNo.'
                              }
                         */

    /* #swagger.parameters['pageLimit'] = {
                               in: 'query',
                               description: 'Enter pageLimit.'
                              }
                         */

    if (expression) {
      // #swagger.responses[201] = { description: 'login history found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/loginActivity/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGIN_HISTORY']
                                #swagger.description = 'Endpoint to view login activity details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'login activity details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/loginActivity/deleteAll", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['LOGIN_HISTORY']
                                #swagger.description = 'Endpoint to delete error log.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'error log  delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*static pages*/
  app.get("/pages/cms/:typeId", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STATIC PAGES']
                        #swagger.description = 'Endpoint to get t&c,privacy pages.' */

    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/pages/faq", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['STATIC PAGES']
                        #swagger.description = 'Endpoint to get faq list.' */
    if (expression) {
      // #swagger.responses[201] = { description: 'Data Found Successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for contactus*/
  app.post("/contactUs/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACTUS']
                            #swagger.description = 'Endpoint to add contactus.' */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $fullName: "",
                                  $email: "",                                  
                                  $message: "",
                                  $phoneNumber:"",
                                  $countryCode:""
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/contactUs/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CONTACTUS']
                           #swagger.description = 'Endpoint to get contactus list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['state'] = {
                         in: 'query',
                         description: 'Enter state.'
                        }
                   */

    /* #swagger.parameters['search'] = {
                         in: 'query',
                         description: 'Enter state.'
                        }
                   */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/contactus/view/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACTUS']
                          #swagger.description = 'Endpoint to view contactus details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/contactus/delete", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CONTACTUS']
                          #swagger.description = 'Endpoint to delete conatcus.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $id: ""
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'conatcus delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for category*/
  app.post("/admin/category/addCategory", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY_MANAGEMENT']
                                      #swagger.description = 'Endpoint to add category.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
             #swagger.parameters['image'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'Select image',
             } 
  

             #swagger.parameters['name'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter name',
             } 
    
          */

    if (expression) {
      // #swagger.responses[201] = { description: 'Category added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/category/categoryList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY_MANAGEMENT']
                                    #swagger.description = 'Endpoint to category list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
                         in: 'query',
                         description: 'Enter search.'
                        }
                   */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    /* #swagger.parameters['stateId'] = {
                         in: 'query',
                         description: 'Enter stateId.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'category list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/category/categoryDetails/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY_MANAGEMENT']
                                    #swagger.description = 'Endpoint to view category details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'category details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/category/editCategory/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY_MANAGEMENT']
                                      #swagger.description = 'Endpoint to edit category.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']  
            
             #swagger.parameters['image'] = {
                 in: 'formData',
                 type: 'file',
                 description: 'Select image',
             } 
  

             #swagger.parameters['name'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'Enter name',
             } 
    
          */

    if (expression) {
      // #swagger.responses[201] = { description: 'Category edit successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/category/updateCategoryState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CATEGORY_MANAGEMENT']
                                 #swagger.description = 'Endpoint to update category state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $stateId: "",
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'category state updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/category/deleteCategory/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY_MANAGEMENT']
                          #swagger.description = 'Endpoint to delete category.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'category delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/category/activeCategory", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY_MANAGEMENT']
                                    #swagger.description = 'Endpoint to active category.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'category details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/category/activeCategory", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CATEGORY_MANAGEMENT']
                                    #swagger.description = 'Endpoint to active category.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'category details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for property*/
  app.post("/users/property/addProperty", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                                    #swagger.description = 'Endpoint to add property.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']

              #swagger.parameters['propertyImgId'] = {
                 in: 'formData',
                 type: 'array',
                 name:'propertyImgId',
                 description: 'Add propertyImgId...',
                 collectionFormat: 'multi',
                 items: { type: 'file' }
             }
     
             #swagger.parameters['categoryId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'categoryId',
                 
             }


             #swagger.parameters['name'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'property name',
                 
             }


             #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'description',
                 
             }
     
             #swagger.parameters['place'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'place.',     
             }

               #swagger.parameters['postalCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'postalCode.',     
             }

              #swagger.parameters['municipality'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'municipality.',     
             }
             
              #swagger.parameters['price'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'price',
             }

              #swagger.parameters['building_fee'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'building_fee',
             }
     
             #swagger.parameters['year_of_construction'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'year_of_construction',
             }

             #swagger.parameters['gross_area'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'gross_area',
             }

             #swagger.parameters['net_area'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'net_area',
             }

              #swagger.parameters['baths'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'baths',
             }

               #swagger.parameters['floor'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'floor',
             }

              #swagger.parameters['energy_class'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'energy_class',
             }

                #swagger.parameters['district'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'district',
             }
               #swagger.parameters['rooms'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'rooms',
             }
               #swagger.parameters['link'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'link',
             }

              #swagger.parameters['reference'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'reference',
              }


              #swagger.parameters['street'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'street',
             }

               #swagger.parameters['building_no'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'building_no',
             }

               #swagger.parameters['municipality'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'municipality',
             }

               #swagger.parameters['elevator'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'elevator',
             }

               #swagger.parameters['type_of_real_estate'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'type_of_real_estate',
             }

                 #swagger.parameters['position'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'position',
             }

               #swagger.parameters['condition'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'condition',
             }

              #swagger.parameters['other_features_real_estate'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'other_features_real_estate',
             }


              #swagger.parameters['other_features_building'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'other_features_building',
             }

              #swagger.parameters['other_features_building'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'other_features_building',
             }

              #swagger.parameters['longitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'longitude.',     
             }

               #swagger.parameters['latitude'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'latitude.',     
             }



               
         */

    if (expression) {
      // #swagger.responses[201] = { description: 'event edit successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/property/propertyListAuth", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                                    #swagger.description = 'Endpoint to property list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    /* #swagger.parameters['propertyType'] = {
                         in: 'query',
                         description: 'Enter propertyType.'
                        }
                   */

    /* #swagger.parameters['minPrice'] = {
                         in: 'query',
                         description: 'Enter minPrice.'
                        }
                   */

    /* #swagger.parameters['maxPrice'] = {
                         in: 'query',
                         description: 'Enter maxPrice.'
                        }
                   */

    /* #swagger.parameters['rooms'] = {
                         in: 'query',
                         description: 'Enter rooms.'
                        }
                   */

    /* #swagger.parameters['baths'] = {
                         in: 'query',
                         description: 'Enter baths.'
                        }
                   */

    /* #swagger.parameters['condition'] = {
                         in: 'query',
                         description: 'Enter condition.'
                        }
                   */

    /* #swagger.parameters['other_features_real_estate'] = {
                         in: 'query',
                         description: 'Enter other_features_real_estate.'
                        }
                   */

    /* #swagger.parameters['other_features_building'] = {
                         in: 'query',
                         description: 'Enter other_features_building.'
                        }
                   */

    /* #swagger.parameters['elevator'] = {
                         in: 'query',
                         description: 'Enter elevator.'
                        }
                   */

    /* #swagger.parameters['floor'] = {
                         in: 'query',
                         description: 'Enter floor.'
                        }
                   */

    /* #swagger.parameters['date'] = {
                         in: 'query',
                         description: 'Enter date.'
                        }
                   */

    /* #swagger.parameters['sort'] = {
                         in: 'query',
                         description: 'Enter sort.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'property list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/property/updateProperty", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                                    #swagger.description = 'Endpoint to add property.' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
          #swagger.consumes = ['multipart/form-data']

              #swagger.parameters['propertyImg'] = {
                 in: 'formData',
                 type: 'array',
                 name:'propertyImg',
                 description: 'Add propertyImg...',
                 collectionFormat: 'multi',
                 items: { type: 'file' }
             }
     
             #swagger.parameters['categoryId'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'categoryId',
                 
             }


             #swagger.parameters['name'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'property name',
                 
             }


             #swagger.parameters['description'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'description',
                 
             }
     
             #swagger.parameters['place'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'place.',     
             }

               #swagger.parameters['postalCode'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'postalCode.',     
             }

              #swagger.parameters['municipality'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'municipality.',     
             }
             
              #swagger.parameters['price'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'price',
             }

              #swagger.parameters['building_fee'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'building_fee',
             }
     
             #swagger.parameters['year_of_construction'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'year_of_construction',
             }

             #swagger.parameters['gross_area'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'gross_area',
             }

             #swagger.parameters['net_area'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'net_area',
             }

              #swagger.parameters['baths'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'baths',
             }

               #swagger.parameters['floor'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'floor',
             }

              #swagger.parameters['energy_class'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'energy_class',
             }

                #swagger.parameters['district'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'district',
             }
               #swagger.parameters['rooms'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'rooms',
             }
               #swagger.parameters['link'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'link',
             }

              #swagger.parameters['reference'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'reference',
              }


              #swagger.parameters['street'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'street',
             }

               #swagger.parameters['building_no'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'building_no',
             }

               #swagger.parameters['municipality'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'municipality',
             }

               #swagger.parameters['elevator'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'elevator',
             }

               #swagger.parameters['type_of_real_estate'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'type_of_real_estate',
             }

                 #swagger.parameters['position'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'position',
             }

               #swagger.parameters['condition'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'condrition',
             }

              #swagger.parameters['other_features_real_estate'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'other_features_real_estate',
             }


              #swagger.parameters['other_features_building'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'other_features_building',
             }

              #swagger.parameters['other_features_building'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'other_features_building',
             }

              #swagger.parameters['csvPrice'] = {
                 in: 'formData',
                 type: 'string',
                 description: 'csvPrice',
             }

              #swagger.parameters['longitude'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'longitude.',     
             }

               #swagger.parameters['latitude'] = {
                 in: 'formData',
                 type: 'number',
                 description: 'latitude.',     
             }
*/

    if (expression) {
      // #swagger.responses[201] = { description: 'event edit successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/property/propertyDetails/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                                    #swagger.description = 'Endpoint to view property details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'property details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/users/property/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                                 #swagger.description = 'Endpoint to update property state.' 
                          */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $state: "",
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'property state updated successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/property/deleteProperty/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                          #swagger.description = 'Endpoint to delete property.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'property deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/csv/exportPropertyCsv/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                                    #swagger.description = 'Endpoint to download property list in csv.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'property list download successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/property/propertyList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                                    #swagger.description = 'Endpoint to property list.' */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    /* #swagger.parameters['search'] = {
                         in: 'query',
                         description: 'Enter search.'
                        }
                   */

    /* #swagger.parameters['minPrice'] = {
                         in: 'query',
                         description: 'Enter minPrice.'
                        }
                   */

    /* #swagger.parameters['maxPrice'] = {
                         in: 'query',
                         description: 'Enter maxPrice.'
                        }
                   */

    /* #swagger.parameters['minSize'] = {
                         in: 'query',
                         description: 'Enter minSize.'
                        }
                   */

    /* #swagger.parameters['maxSize'] = {
                         in: 'query',
                         description: 'Enter maxSize.'
                        }
                   */

    /* #swagger.parameters['rooms'] = {
                         in: 'query',
                         description: 'Enter rooms.'
                        }
                   */

    /* #swagger.parameters['condition'] = {
                         in: 'query',
                         description: 'Enter condition.'
                        }
                   */

    /* #swagger.parameters['date'] = {
                         in: 'query',
                         description: 'Enter date.'
                        }
                   */

    /* #swagger.parameters['sort'] = {
                         in: 'query',
                         description: 'Enter sort.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'property list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/property/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                    #swagger.description = 'Endpoint to view property details.' */

    if (expression) {
      // #swagger.responses[201] = { description: 'property details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/property/myProperty", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                                    #swagger.description = 'Endpoint to get property list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                         in: 'query',
                         description: 'Enter pageNo.'
                        }
                   */

    /* #swagger.parameters['pageLimit'] = {
                         in: 'query',
                         description: 'Enter pageLimit.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'property list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/users/property/sendQuery", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                        #swagger.description = 'Endpoint to send query regarding property.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                       in: 'body',
                       description: 'Some description...',
                       schema: {
                              $propertyId: "",
                              $firstName: "",
                              $lastName: "",
                              $email:"",
                              $message:""
                       }
               } */

    if (expression) {
      // #swagger.responses[201] = { description: 'query sended successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/property/downloadFull", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                    #swagger.description = 'Endpoint to view property details.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'property details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.post("/admin/csv/imoprtPropertyCsv", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
                                    #swagger.description = 'Endpoint to import property file.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
          #swagger.consumes = ['multipart/form-data']

              #swagger.parameters['csvFile'] = {
                 in: 'formData',
                 type: 'array',
                 name:'csvFile',
                 description: 'Add csvFile...',
                 collectionFormat: 'multi',
                 items: { type: 'file' }
             }
             
             */

    if (expression) {
      // #swagger.responses[201] = { description: 'property file imoprt successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/property/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PROPERTY_MANAGEMENT']
              #swagger.description = 'Endpoint to get product details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'product details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for cart*/
  app.post("/users/cart/addCart", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CART_MANAGEMENT']
                            #swagger.description = 'Endpoint to add property in cart.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                           in: 'body',
                           description: 'Some description...',
                           schema: {
                                  $productId: "",
                           }
                   } */

    if (expression) {
      // #swagger.responses[201] = { description: 'property added in cart successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/cart/mycarts", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CART_MANAGEMENT']
                           #swagger.description = 'Endpoint to get cart list.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/cart/removeCart/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CART_MANAGEMENT']
                           #swagger.description = 'Endpoint to remove property from cart.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: ' property remove from cart successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/cart/clearCart", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['CART_MANAGEMENT']
                           #swagger.description = 'Endpoint to clear cart.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'cart clear successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for favourite*/
  app.post("/users/favourite/addFavourite", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['FAVOURITE_PROPERTY']
                        #swagger.description = 'Endpoint to favourite property.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                       in: 'body',
                       description: 'Some description...',
                       schema: {
                              $propertyId: "",
                              $isFavourite: "",
                       }
               } */

    if (expression) {
      // #swagger.responses[201] = { description: 'property favourite successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/favourite/favouriteList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['FAVOURITE_PROPERTY']
                       #swagger.description = 'Endpoint to get favourite property list.' 
                */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                     in: 'query',
                     description: 'Enter pageNo.'
                    }
               */

    /* #swagger.parameters['pageLimit'] = {
                     in: 'query',
                     description: 'Enter pageLimit.'
                    }
               */

    /* #swagger.parameters['sort'] = {
                     in: 'query',
                     description: 'Enter sort.'
                    }
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'favourite property list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for order*/
  app.post("/users/order/createOrder", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['Order']
                        #swagger.description = 'Endpoint to create order.' */
    /* #swagger.security = [{ "Bearer": [] }] */
    /*  #swagger.parameters['obj'] = {
                       in: 'body',
                       description: 'Some description...',
                       schema: {
                              $propertyId:"",
                              $orderTotal: "",
                              $total: "",
                     }
               } */

    if (expression) {
      // #swagger.responses[201] = { description: 'order created successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/order/myOrderList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['Order']
                       #swagger.description = 'Endpoint to get order list.' 
                */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                     in: 'query',
                     description: 'Enter pageNo.'
                    }
               */

    /* #swagger.parameters['pageLimit'] = {
                     in: 'query',
                     description: 'Enter pageLimit.'
                    }
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'order list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/order/deleteOrder/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['Order']
                       #swagger.description = 'Endpoint to delete order.' 
                */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order deleted successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/order/orderList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['Order']
                       #swagger.description = 'Endpoint to get order list.' 
                */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                     in: 'query',
                     description: 'Enter pageNo.'
                    }
               */

    /* #swagger.parameters['pageLimit'] = {
                     in: 'query',
                     description: 'Enter pageLimit.'
                    }
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'order list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/order/orderView/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['Order']
                       #swagger.description = 'Endpoint to view order details.' 
                */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'order details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for delete search*/
  app.post("/users/search/saveSearch", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SAVED_SEARCHES']
                        #swagger.description = 'Endpoint to save search.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                       in: 'body',
                       description: 'Some description...',
                       schema: {
                              $propertyId: "",
                              $search: "",
                              $minPrice: "",
                              $maxPrice: "",
                              $minSize: "",
                              $maxSize: "",
                              $rooms: "",
                              $baths:"",
                              $propertyType: "",
                              $condition: "",
                              $other_features_real_estate:"",
                              $other_features_building:"",
                              $floor:"",
                              $elevator:"",
                              $search:""


                       }
               } */

    if (expression) {
      // #swagger.responses[201] = { description: 'search saved successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/search/mySearchList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SAVED_SEARCHES']
                       #swagger.description = 'Endpoint to get saved search list.' 
                */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                     in: 'query',
                     description: 'Enter pageNo.'
                    }
               */

    /* #swagger.parameters['pageLimit'] = {
                     in: 'query',
                     description: 'Enter pageLimit.'
                    }
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.put("/users/search/updateSearch", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SAVED_SEARCHES']
                        #swagger.description = 'Endpoint to save search.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                       in: 'body',
                       description: 'Some description...',
                       schema: {
                              $id:"",
                              $propertyId: "",
                              $search: "",
                              $minPrice: "",
                              $maxPrice: "",
                              $minSize: "",
                              $maxSize: "",
                              $rooms: "",
                              $baths:"",
                              $propertyType: "",
                              $condition: "",
                              $other_features_real_estate:"",
                              $other_features_building:"",
                              $floor:"",
                              $elevator:"",
                              $search:""



                       }
               } */

    if (expression) {
      // #swagger.responses[201] = { description: 'search saved successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/search/deleteSearch/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['SAVED_SEARCHES']
                           #swagger.description = 'Endpoint to delete saved search.' 
                    */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search deleted successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.put("/users/search/enableDisable", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['SAVED_SEARCHES']
                        #swagger.description = 'Endpoint to save search.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                       in: 'body',
                       description: 'Some description...',
                       schema: {
                              $id: "",
                              $typeId: "",
                       }
               } */

    if (expression) {
      // #swagger.responses[201] = { description: 'search saved successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for payment*/
  app.get("/admin/payment/paymentList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                       #swagger.description = 'Endpoint to get saved search list.' 
                */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['pageNo'] = {
                     in: 'query',
                     description: 'Enter pageNo.'
                    }
               */

    /* #swagger.parameters['pageLimit'] = {
                     in: 'query',
                     description: 'Enter pageLimit.'
                    }
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'saved search list found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/payment/transactionView/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PAYMENT']
                       #swagger.description = 'Endpoint to get transaction details.' 
                */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'transaction details found successfully.' }
      return res.status(200).send(data);
    }
    return res.status(500);
  });

  /*Routes for notification*/
  app.get("/users/notification/myNotification", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['NOTIFICATION']
                      #swagger.description = 'Endpoint to notification list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'notification list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/notification/deleteNotification", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['NOTIFICATION']
                      #swagger.description = 'Endpoint to delete.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'notification delete successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for card*/
  app.post("/users/payment/addCard", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CARD']
                        #swagger.description = 'Endpoint to add card.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*  #swagger.parameters['obj'] = {
                               in: 'body',
                               title: 'Some description...',
                               schema: {
                                      $cardTokenId: "",
                                       },
                                   }
                       } */

    if (expression) {
      // #swagger.responses[201] = { description: 'card added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/payment/cardList", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CARD']
                      #swagger.description = 'Endpoint to get card list.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'card list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/users/payment/deleteCard/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['CARD']
                #swagger.description = 'Endpoint to delete card.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'card deleted successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for product*/
  app.post("/admin/product/add", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
                #swagger.description = 'Endpoint to add product.' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
    
      #swagger.consumes = ['multipart/form-data']  
       #swagger.parameters['productImg'] = {
        in: 'formData',
        type: 'array',
        name:'productImg',
        description: 'Add productImg...',
        collectionFormat: 'multi',
        items: { type: 'file' }
    }

     #swagger.parameters['productFile'] = {
        in: 'formData',
        type: 'array',
        name:'productFile',
        description: 'Add productFile...',
        collectionFormat: 'multi',
        items: { type: 'file' }
    }
           
               #swagger.parameters['productName'] = {
                in: 'formData',
                type: 'string',
                name:'productName',
                description: 'Some description...',
          } 
            
           #swagger.parameters['price'] = {
                in: 'formData',
                type: 'number',
                name:'price',
                description: 'Some price...',
          } 
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/product/edit/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
                #swagger.description = 'Endpoint to add product.' */

    /* #swagger.security = [{ "Bearer": [] }] */
    /*
    
      #swagger.consumes = ['multipart/form-data']  
       #swagger.parameters['productImg'] = {
        in: 'formData',
        type: 'array',
        name:'productImg',
        description: 'Add productImg...',
        collectionFormat: 'multi',
        items: { type: 'file' }
    }

     #swagger.parameters['productFile'] = {
        in: 'formData',
        type: 'array',
        name:'productFile',
        description: 'Add productFile...',
        collectionFormat: 'multi',
        items: { type: 'file' }
    }
           
               #swagger.parameters['productName'] = {
                in: 'formData',
                type: 'string',
                name:'productName',
                description: 'Some description...',
          } 
            
           #swagger.parameters['price'] = {
                in: 'formData',
                type: 'number',
                name:'price',
                description: 'Some price...',
          } 
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/product/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/admin/product/details/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
              #swagger.description = 'Endpoint to get product details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'product details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.delete("/admin/product/delete/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
              #swagger.description = 'Endpoint to get product details.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    if (expression) {
      // #swagger.responses[201] = { description: 'product details found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.put("/admin/product/updateState/:id", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PRODUCT']
                            #swagger.description = 'Endpoint to add contactus.' */
    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['stateId'] = {
                         in: 'query',
                         description: 'Enter stateId.'
                        }
                   */

    if (expression) {
      // #swagger.responses[201] = { description: 'contactus added successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/product/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PRODUCT']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for places*/
  app.post("/admin/place/addPlace", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['PLACE']
                                      #swagger.description = 'Endpoint to import property file.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
            #swagger.consumes = ['multipart/form-data']
  
                #swagger.parameters['csvFile'] = {
                   in: 'formData',
                   type: 'array',
                   name:'csvFile',
                   description: 'Add csvFile...',
                   collectionFormat: 'multi',
                   items: { type: 'file' }
               }
               
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'property file imoprt successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/place/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['PLACE']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */
    /* #swagger.parameters['municipalityId'] = {
           in: 'query',
           description: 'Enter municipalityId.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for municiplity*/
  app.post("/admin/municiplity/addMuniciplity", (req, res) => {
    res.setHeader("Content-Type", "application/xml");
    /*  #swagger.tags = ['MUNICIPLITY']
                                      #swagger.description = 'Endpoint to import property file.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /*
            #swagger.consumes = ['multipart/form-data']
  
                #swagger.parameters['csvFile'] = {
                   in: 'formData',
                   type: 'array',
                   name:'csvFile',
                   description: 'Add csvFile...',
                   collectionFormat: 'multi',
                   items: { type: 'file' }
               }
               
               */

    if (expression) {
      // #swagger.responses[201] = { description: 'property file imoprt successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
  app.get("/users/municiplity/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['MUNICIPLITY']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['districtId'] = {
           in: 'query',
           description: 'Enter districtId.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });

  /*Routes for district*/
  app.get("/users/district/list", (req, res) => {
    res.setHeader("Content-Type", "application/xml");

    /*  #swagger.tags = ['DISTRICT']
              #swagger.description = 'Endpoint to get all product list.' */

    /* #swagger.security = [{ "Bearer": [] }] */

    /* #swagger.parameters['search'] = {
           in: 'query',
           description: 'Enter search.'
          }
     */

    /* #swagger.parameters['pageNo'] = {
           in: 'query',
           description: 'Enter pageNo.'
          }
     */

    /* #swagger.parameters['pageLimit'] = {
           in: 'query',
           description: 'Enter pageLimit.'
          }
     */

    if (expression) {
      // #swagger.responses[201] = { description: 'product list found successfully.' }
      return res.status(201).send(data);
    }
    return res.status(500);
  });
};
