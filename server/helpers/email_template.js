/** 
@copyright : Hotopics Unipessoal Lda. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Hotopics Unipessoal Lda. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const nodemailer = require("nodemailer");
// const EMAIL_LOG = require("../app/emailLogs/model/emailModel");
const CONST = require("../helpers/constant");
// require('../images/web-logo.png')
let dotenv = require("dotenv");
dotenv.config();

module.exports = {
  ACCOUNT_VERIFICATION_TEMPLATE(email, username, otp) {
    return ` <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${process.env.PROJECT_NAME} | Email template </title>
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap"
            rel="stylesheet">
        <style type="text/css">
            body {
                font-family: Nunito, sans-serif;
                position: relative;
                background: white;
                font-size: 14px;
                color: black;
            }
    
            ul {
                margin: 0;
                padding: 0;
            }
    
            li {
                display: inline-block;
                text-decoration: unset;
            }
    
            a {
                text-decoration: none;
            }
    
            .btn {
                background-color: #292929;
                border-color: transparent;
                -webkit-print-color-adjust: exact;
                letter-spacing: 0.4px;
                border-radius: 4px;
                font-weight: 800;
                font-size: 14px;
                line-height: 19px;
                color: #FFFFFF;
                cursor: pointer;
                padding: 7px 13px;
                -webkit-box-shadow: 1px 11px 20px 0px rgba(233, 179, 14, 0.12);
                box-shadow: 1px 11px 20px 0px rgba(233, 179, 14, 0.12);
                text-transform: capitalize;
    
            }
    
            .btn:focus {
                outline: none;
            }
    
            .text-center {
                text-align: center
            }
    
            .template-width {
                width: 724px;
            }
    
            .success-img img {
                width: 60%;
                margin: 10px 0 10px;
            }
    
            .booking-table {
                width: 100%;
                border: 1px solid #dddddd;
                margin-top: 40px;
            }
    
            @media (max-width: 767px) {
                .template-width {
                    width: 550px;
                }
    
                .booking-table .booking-td {
                    width: 100% !important;
                    display: block;
                }
    
                .booking-table tr .booking-td:first-child {
                    border-right: none !important;
                }
    
            }
    
            @media (max-width: 576px) {
                .template-width {
                    width: 420px;
                }
    
                .success-img h3 {
                    width: 90% !important;
                }
            }
    
            @media (max-width: 480px) {
                .template-width {
                    width: 300px;
                }
            }
        </style>
    </head>
    
    <body style="background-color:#fff;font-family: color: #202020;font-size: 15px;line-height: 24px; margin:80px 20px;">
          <table className="template-width" align="center" border="0" cellpadding="0" cellspacing="0"
            style="background-color: #fff; max-width: 650px;width: 100%;  box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);">
            <tbody>
                <tr>
                    <td style="padding: 0 20px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                                <tr className="header">
                                    <td align="left" valign="top">
    
                                    </td>
                                    <td className="menu" align="right">
    
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                  <tr>
                     <td style="padding:20px 30px;background: #004aad;border-bottom:1px solid #daebe1" align="center">
                         <a href="#0" style="color: #28a745;text-decoration: none">
                               <h1 style="font-weight: 800;color:#fff ;font-size:25px;margin:0px;text-transform: uppercase;">
                               PRIVATE MARKETS
                               </h1>
                           </a>
                     </td>
                  </tr>
                  <tr>
                   <td style="padding: 20px 30px">
                      <table width="100%">
                         <tr>
                            <td style="padding: 20px 30px 20px 30px; background: #f4f5f2" align="center">
                               <h2 style="font-size: 24px; margin: 0; color: #080655; line-height: 30px;">
                                  Warm Greetings !!</h2>
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr>
                  <td className="success-img" style="padding: 30px; text-align:center; display: block; margin:0 auto; ">
 						          <img src="${process.env.LIVE_IP}api/public/images/logo.svg">
                  </td>
                </tr>
                <tr>
                    <td  style="text-align: center;">
                        <h2 style="margin: 0 auto; width: 90%;  font-size:calc(18px + (22 - 18) * ((100vw - 320px) / (1920 - 320)));">
                        Hi ${username ? username : "User"}!</h2>
                            <p style="margin: 20px auto; width: 90%;  font-size:calc(16px + (20 - 18) * ((100vw - 320px) / (1920 - 320)));" > Please verify your email for ${
                              process.env.PROJECT_NAME
                            }.</p>
                        <h3 style="margin: 0 auto 28px; padding: 0 20px; line-height: 1.4;color: #9a9a9a;font-weight: 400;">Enter below otp to Verify your Account.
                        </h3>
                        <a id="myInput" onclick="myFunction()" style="background-color: #004aad; padding:10px 25px; text-align: center; font-size: 14px;
                            line-height: 24px; color: #fff !important; font-weight: 600;">${otp}</a>
                         
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px;">
                    </td>
                </tr>
                <tr>
                  <td style="color: #fff !important; font-size: 14px; text-align: center; padding: 10px 0px; background:  #004aad">
                      <span className="mb-0">
                        Copyright &copy; 2024
                        <a target="_blank" style="color: #fff !important; text-decoration: none;"  href="#">
                          Hotopics Unipessoal Lda
                        </a>
                        . All Rights Reserved.
                      </span>
                  </td>
                </tr>
            </tbody>
        </table>
    
    </body>
    <script>
        function myFunction() {
            // Get the text field
            // Copy the text inside the text field
            navigator.clipboard.writeText(otp);
    
        }
    </script
    </html> `;
  },

  WELCOME_EMAIL_TEMPLATE(name) {
    return ` <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${process.env.PROJECT_NAME} | Email template </title>
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap"
            rel="stylesheet">
        <style type="text/css">
            body {
                font-family: Nunito, sans-serif;
                position: relative;
                background: white;
                font-size: 14px;
                color: black;
            }
    
            ul {
                margin: 0;
                padding: 0;
            }
    
            li {
                display: inline-block;
                text-decoration: unset;
            }
    
            a {
                text-decoration: none;
            }
    
            .btn {
                background-color: #292929;
                border-color: transparent;
                -webkit-print-color-adjust: exact;
                letter-spacing: 0.4px;
                border-radius: 4px;
                font-weight: 800;
                font-size: 14px;
                line-height: 19px;
                color: #FFFFFF;
                cursor: pointer;
                padding: 7px 13px;
                -webkit-box-shadow: 1px 11px 20px 0px rgba(233, 179, 14, 0.12);
                box-shadow: 1px 11px 20px 0px rgba(233, 179, 14, 0.12);
                text-transform: capitalize;
    
            }
    
            .btn:focus {
                outline: none;
            }
    
            .text-center {
                text-align: center
            }
    
            .template-width {
                width: 724px;
            }
    
            .success-img img {
                width: 60%;
                margin: 10px 0 10px;
            }
    
            .booking-table {
                width: 100%;
                border: 1px solid #dddddd;
                margin-top: 40px;
            }
    
            @media (max-width: 767px) {
                .template-width {
                    width: 550px;
                }
    
                .booking-table .booking-td {
                    width: 100% !important;
                    display: block;
                }
    
                .booking-table tr .booking-td:first-child {
                    border-right: none !important;
                }
    
            }
    
            @media (max-width: 576px) {
                .template-width {
                    width: 420px;
                }
    
                .success-img h3 {
                    width: 90% !important;
                }
            }
    
            @media (max-width: 480px) {
                .template-width {
                    width: 300px;
                }
            }
        </style>
    </head>
    
    <body style="background-color:#fff;font-family: color: #202020;font-size: 15px;line-height: 24px; margin:80px 20px;">
        <table className="template-width" align="center" border="0" cellpadding="0" cellspacing="0"
            style="background-color: #fff; max-width: 650px;width: 100%;  box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);">
            <tbody>
                <tr>
                    <td style="padding: 0 20px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                                <tr className="header">
                                    <td align="left" valign="top">
    
                                    </td>
                                    <td className="menu" align="right">
    
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                  <tr>
                     <td style="padding:20px 30px;background: #004aad;border-bottom:1px solid #daebe1" align="center">
                         <a href="#0" style="color: #28a745;text-decoration: none">
                               <h1 style="font-weight: 800;color:#fff ;font-size:25px;margin:0px;text-transform: uppercase;">
                               PRIVATE MARKETS
                               </h1>
                           </a>
                     </td>
                  </tr>
                  <tr>
                   <td style="padding: 20px 30px">
                      <table width="100%">
                         <tr>
                            <td style="padding: 20px 30px 20px 30px; background: #f4f5f2" align="center">
                               <h2 style="font-size: 24px; margin: 0; color: #080655; line-height: 30px;">
                                  Warm Greetings !!</h2>
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr>
                  <td className="success-img" style="padding: 30px; text-align:center; display: block; margin:0 auto; ">
 						        <img src="${process.env.LIVE_IP}/api/public/images/logo.svg">
                  </td>
                </tr>
                <tr>
                    <td  style="text-align: center;">
                        <h2 style="margin: 0 auto; width: 90%;  font-size:calc(18px + (22 - 18) * ((100vw - 320px) / (1920 - 320)));">
                           Congratulations ${name ? name : "User"}!</h2>
                            <p style="margin: 20px auto; width: 90%;  font-size:calc(16px + (20 - 18) * ((100vw - 320px) / (1920 - 320)));" > Welcome to private markets ! Your account has been created successfully</p>
                        <h3 style="margin: 0 auto 28px; padding: 0 20px; line-height: 1.4;color: #9a9a9a;font-weight:600;"> Thank you for joining us!
                        </h3>
                        
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px;">
                    </td>
                </tr>
                <tr>
                  <td style="color: #fff !important; font-size: 14px; text-align: center; padding: 10px 0px; background:  #004aad">
                          <span className="mb-0"> Copyright &copy; 2024
                              <a target="_blank" style="color: #fff !important; text-decoration: none;"  href="#">
                                Hotopics Unipessoal Lda
                              </a> . All Rights Reserved.
                        </span>
                  </td>
              </tr>
            </tbody>
        </table>
    
    </body>
    <script>
        function myFunction() {
            // Get the text field
            // Copy the text inside the text field
            navigator.clipboard.writeText(otp);
    
        }
    </script>
    
    </html>
    `;
  },

  RESET_PASSWORD_EMAIL_TEMPLATE(link) {
    return `
        <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${process.env.PROJECT_NAME} | Email template </title>
        <link
          href="https://fonts.googleapis.com/css?family=Nunito:300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap"
          rel="stylesheet">
        <style type="text/css">
            body {
                font-family: Nunito, sans-serif;
                position: relative;
                background: white;
                font-size: 14px;
                color: black;
            }

            ul {
                margin: 0;
                padding: 0;
            }

            li {
                display: inline-block;
                text-decoration: unset;
            }

            a {
                text-decoration: none;
            }

            .btn {
                background-color: #292929;
                border-color: transparent;
                -webkit-print-color-adjust: exact;
                letter-spacing: 0.4px;
                border-radius: 4px;
                font-weight: 800;
                font-size: 14px;
                line-height: 19px;
                color: #FFFFFF;
                cursor: pointer;
                padding: 7px 13px;
                -webkit-box-shadow: 1px 11px 20px 0px rgba(233, 179, 14, 0.12);
                box-shadow: 1px 11px 20px 0px rgba(233, 179, 14, 0.12);
                text-transform: capitalize;

            }

            .btn:focus {
                outline: none;
            }

            .text-center {
                text-align: center
            }

            .template-width {
                width: 724px;
            }

            .success-img img {
                width: 60%;
                margin: 10px 0 10px;
            }

            .booking-table {
                width: 100%;
                border: 1px solid #dddddd;
                margin-top: 40px;
            }

            @media (max-width: 767px) {
                .template-width {
                    width: 550px;
                }

                .booking-table .booking-td {
                    width: 100% !important;
                    display: block;
                }

                .booking-table tr .booking-td:first-child {
                    border-right: none !important;
                }

            }

            @media (max-width: 576px) {
                .template-width {
                    width: 420px;
                }

                .success-img h3 {
                    width: 90% !important;
                }
            }

            @media (max-width: 480px) {
                .template-width {
                    width: 300px;
                }
            }
        </style>
      </head>

      <body
        style="background-color:#fff;font-family: color: #202020;font-size: 15px;line-height: 24px; margin:80px 20px;">
        <table className="template-width" align="center" border="0" cellpadding="0"
          cellspacing="0"
          style="background-color: #fff; max-width: 650px;width: 100%;  box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);">
          <tbody>
            <tr>
              <td style="padding: 0 20px;">
                <table align="center" border="0" cellpadding="0" cellspacing="0"
                  width="100%">
                  <tbody>
                    <tr className="header">
                      <td align="left" valign="top">

                      </td>
                      <td className="menu" align="right">

                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td
                style="padding:20px 30px;background: #004aad;border-bottom:1px solid #daebe1"
                align="center">
                <a href="#0" style="color: #28a745;text-decoration: none">
                  <h1
                    style="font-weight: 800;color:#fff ;font-size:25px;margin:0px;text-transform: uppercase;">
                    PRIVATE MARKETS
                  </h1>
                </a>

              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px">
                <table width="100%">
                  <tr>
                    <td style="padding: 20px 30px 20px 30px; background: #f4f5f2"
                      align="center">
                      <h2
                        style="font-size: 24px; margin: 0; color: #080655; line-height: 30px;">
                        Warm Greetings !!</h2>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td className="success-img"
                style="padding: 30px; text-align:center; display: block; margin:0 auto; ">
                <img src="${process.env.LIVE_IP}/api/public/images/logo.svg">
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <h2
                  style="margin: 0 auto; width: 90%;  font-size:calc(18px + (22 - 18) * ((100vw - 320px) / (1920 - 320)));">
                  Reset Your Password
                </h2>
                <p
                  style="margin: 20px auto; width: 90%;  font-size:calc(16px + (20 - 18) * ((100vw - 320px) / (1920 - 320)));">
                  If you've lost your password or wish to reset it, <br /> use the
                  link below
                </p>

                <a href="${link}"
                  style="background-color: #004aad; padding:10px 25px; text-align: center; font-size: 14px;
                            line-height: 24px; color: #fff !important; font-weight: 600;">
                  Reset Your Password
                </a>
                <p
                  style="margin: 20px auto; width: 90%; color: #9a9a9a;font-weight:600;  font-size:calc(14px + (20 - 18) * ((100vw - 320px) / (1920 - 320)));">

                  If you did not request a password reset, you can safely ignore
                  this email.
                  only a person with access to your email can reset your account
                  2024 My Goals.

                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px;">
              </td>
            </tr>

            <tr>
              <td
                style="color: #fff !important; font-size: 14px; text-align: center; padding: 10px 0px; background:  #004aad">
                <span className="mb-0">
                  Copyright &copy; 2024
                  <a target="_blank" style="color: #fff !important; text-decoration: none;"
                    href="#">
                    Hotopics Unipessoal Lda
                  </a>
                  . All Rights Reserved.
                </span>

              </td>
            </tr>
          </tbody>
        </table>

      </body>
      <script>
        function myFunction() {
            // Get the text field
            // Copy the text inside the text field
            navigator.clipboard.writeText(otp);

        }
      </script>

      </html>
    `;
  },

  FORGOT_PASSWORD_OTP(username, otp) {
    return `  <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${process.env.PROJECT_NAME} | Email template </title>
          <link
              href="https://fonts.googleapis.com/css?family=Nunito:300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap"
              rel="stylesheet">
          <style type="text/css">
              body {
                  font-family: Nunito, sans-serif;
                  position: relative;
                  background: white;
                  font-size: 14px;
                  color: black;
              }

              ul {
                  margin: 0;
                  padding: 0;
              }

              li {
                  display: inline-block;
                  text-decoration: unset;
              }

              a {
                  text-decoration: none;
              }

              .btn {
                  background-color: #292929;
                  border-color: transparent;
                  -webkit-print-color-adjust: exact;
                  letter-spacing: 0.4px;
                  border-radius: 4px;
                  font-weight: 800;
                  font-size: 14px;
                  line-height: 19px;
                  color: #FFFFFF;
                  cursor: pointer;
                  padding: 7px 13px;
                  -webkit-box-shadow: 1px 11px 20px 0px rgba(233, 179, 14, 0.12);
                  box-shadow: 1px 11px 20px 0px rgba(233, 179, 14, 0.12);
                  text-transform: capitalize;

              }

              .btn:focus {
                  outline: none;
              }

              .text-center {
                  text-align: center
              }

              .template-width {
                  width: 724px;
              }

              .success-img img {
                  width: 60%;
                  margin: 10px 0 10px;
              }

              .booking-table {
                  width: 100%;
                  border: 1px solid #dddddd;
                  margin-top: 40px;
              }

              @media (max-width: 767px) {
                  .template-width {
                      width: 550px;
                  }

                  .booking-table .booking-td {
                      width: 100% !important;
                      display: block;
                  }

                  .booking-table tr .booking-td:first-child {
                      border-right: none !important;
                  }

              }

              @media (max-width: 576px) {
                  .template-width {
                      width: 420px;
                  }

                  .success-img h3 {
                      width: 90% !important;
                  }
              }

              @media (max-width: 480px) {
                  .template-width {
                      width: 300px;
                  }
              }
          </style>
      </head>

      <body style="background-color:#fff;font-family: color: #202020;font-size: 15px;line-height: 24px; margin:80px 20px;">
          <table className="template-width" align="center" border="0" cellpadding="0" cellspacing="0"
              style="background-color: #fff; max-width: 650px;width: 100%;  box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);">
              <tbody>
                  <tr>
                      <td style="padding: 0 20px;">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                              <tbody>
                                  <tr className="header">
                                      <td align="left" valign="top">

                                      </td>
                                      <td className="menu" align="right">

                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
                    <tr>
                        <td style="padding:20px 30px;background: #004aad;border-bottom:1px solid #daebe1" align="center">
                            <a href="#0" style="color: #28a745;text-decoration: none">
                                  <h1 style="font-weight: 800;color:#fff ;font-size:25px;margin:0px;text-transform: uppercase;">
                                  PRIVATE MARKETS
                                  </h1>
                              </a>
                          
                        </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 30px">
                        <table width="100%">
                            <tr>
                              <td style="padding: 20px 30px 20px 30px; background: #f4f5f2" align="center">
                                  <h2 style="font-size: 24px; margin: 0; color: #080655; line-height: 30px;">
                                    Warm Greetings !!</h2>
                              </td>
                            </tr>
                        </table>
                      </td>
                  </tr>
                  <tr>
                    <td className="success-img" style="padding: 30px; text-align:center; display: block; margin:0 auto; ">
                      <img src="${
                        process.env.LIVE_IP
                      }api/public/images/logo.svg">
                    </td>
                  </tr>
                  <tr>
                      <td  style="text-align: center;">
                          <h2 style="margin: 0 auto; width: 90%;  font-size:calc(18px + (22 - 18) * ((100vw - 320px) / (1920 - 320)));">
                              Hi ${username ? username : "User"}!
                            </h2>
                              <p style="margin: 20px auto 10px; width: 90%;  font-size:calc(16px + (20 - 18) * ((100vw - 320px) / (1920 - 320))); margin-bottom:20px;" >Use the following OTP to reset your password for <b> ${
                                process.env.PROJECT_NAME
                              } </b> .
                              </p>
                          <a id="myInput" onclick="myFunction()"  style="background-color: #004aad; padding:10px 25px; text-align: center; font-size: 14px;
                              line-height: 24px; color: #fff !important; font-weight: 600;">
                              ${otp}
                            </a>
                          
                      </td>
                  </tr>
                  <tr>
                      <td style="padding: 20px;">
                      </td>
                  </tr>
                  
                  <tr>
                    <td style="color: #fff !important; font-size: 14px; text-align: center; padding: 10px 0px; background:  #004aad">
                        <span className="margin-bottom: 0;">
                                Copyright &copy; 2024
                                <a target="_blank" style="color: #fff !important; text-decoration: none;"  href="#">
                                  Hotopics Unipessoal Lda
                                </a>
                                . All Rights Reserved.
                        </span>
                    </td>
                  </tr>
              </tbody>
          </table>

      </body>
      <script>
          function myFunction() {
              // Get the text field
              // Copy the text inside the text field
              navigator.clipboard.writeText(otp);
          }
      </script>

      </html>`;
  },

  RESEND_OTP(username, otp) {
    return ` <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${process.env.PROJECT_NAME} | Email template </title>
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap"
            rel="stylesheet">
        <style type="text/css">
            body {
                font-family: Nunito, sans-serif;
                position: relative;
                background: white;
                font-size: 14px;
                color: black;
            }
    
            ul {
                margin: 0;
                padding: 0;
            }
    
            li {
                display: inline-block;
                text-decoration: unset;
            }
    
            a {
                text-decoration: none;
            }
    
            .btn {
                background-color: #292929;
                border-color: transparent;
                -webkit-print-color-adjust: exact;
                letter-spacing: 0.4px;
                border-radius: 4px;
                font-weight: 800;
                font-size: 14px;
                line-height: 19px;
                color: #FFFFFF;
                cursor: pointer;
                padding: 7px 13px;
                -webkit-box-shadow: 1px 11px 20px 0px rgba(233, 179, 14, 0.12);
                box-shadow: 1px 11px 20px 0px rgba(233, 179, 14, 0.12);
                text-transform: capitalize;
    
            }
    
            .btn:focus {
                outline: none;
            }
    
            .text-center {
                text-align: center
            }
    
            .template-width {
                width: 724px;
            }
    
            .success-img img {
                width: 60%;
                margin: 10px 0 10px;
            }
    
            .booking-table {
                width: 100%;
                border: 1px solid #dddddd;
                margin-top: 40px;
            }
    
            @media (max-width: 767px) {
                .template-width {
                    width: 550px;
                }
    
                .booking-table .booking-td {
                    width: 100% !important;
                    display: block;
                }
    
                .booking-table tr .booking-td:first-child {
                    border-right: none !important;
                }
    
            }
    
            @media (max-width: 576px) {
                .template-width {
                    width: 420px;
                }
    
                .success-img h3 {
                    width: 90% !important;
                }
            }
    
            @media (max-width: 480px) {
                .template-width {
                    width: 300px;
                }
            }
        </style>
    </head>
    
    <body style="background-color:#fff;font-family: color: #202020;font-size: 15px;line-height: 24px; margin:80px 20px;">
        <table className="template-width" align="center" border="0" cellpadding="0" cellspacing="0"
            style="background-color: #fff; max-width: 650px;width: 100%;  box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);">
            <tbody>
                <tr>
                    <td style="padding: 0 20px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                                <tr className="header">
                                    <td align="left" valign="top">
    
                                    </td>
                                    <td className="menu" align="right">
    
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                  <tr>
                     <td style="padding:20px 30px;background: #004aad;border-bottom:1px solid #daebe1" align="center">
                         <a href="#0" style="color: #28a745;text-decoration: none">
                               <h1 style="font-weight: 800;color:#fff ;font-size:25px;margin:0px;text-transform: uppercase;">
                               PRIVATE MARKETS
                               </h1>
                           </a>
                     </td>
                  </tr>
                  <tr>
                   <td style="padding: 20px 30px">
                      <table width="100%">
                         <tr>
                            <td style="padding: 20px 30px 20px 30px; background: #f4f5f2" align="center">
                               <h2 style="font-size: 24px; margin: 0; color: #080655; line-height: 30px;">
                                  Warm Greetings !!</h2>
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr>
                  <td className="success-img" style="padding: 30px; text-align:center; display: block; margin:0 auto; ">
 						        <img src="${process.env.LIVE_IP}api/public/images/logo.svg">
                  </td>
                </tr>
                <tr>
                    <td  style="text-align: center;">
                        <h2 style="margin: 0 auto; width: 90%;  font-size:calc(18px + (22 - 18) * ((100vw - 320px) / (1920 - 320)));">
                        Hi ${username ? username : "User"}!
                         </h2>
                            <p style="margin: 20px auto 10px; width: 90%;  font-size:calc(16px + (20 - 18) * ((100vw - 320px) / (1920 - 320)));" >Use the following OTP to reset your password for  <b> ${
                              process.env.PROJECT_NAME
                            } </b> .
                           </p>
                           
                        <p style="margin: 0px auto 20px; width: 90%; color: #9a9a9a;font-weight:600;  font-size:calc(14px + (20 - 18) * ((100vw - 320px) / (1920 - 320))); margin-bottom:20px;" >
                        Enter below otp to Verify your Account.
                          </p>
                          <a id="myInput" onclick="myFunction()"  style="background-color: #004aad; padding:10px 25px; text-align: center; font-size: 14px;
                          line-height: 24px; color: #fff !important; font-weight: 600;">
                          ${otp}
                        </a>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px;">
                    </td>
                </tr>
                <tr>
                  <td style="color: #fff !important; font-size: 14px; text-align: center; padding: 10px 0px; background:  #004aad">
                      <span className="margin-bottom: 0;">
                        Copyright &copy; 2024
                        <a target="_blank" style="color: #fff !important; text-decoration: none;"  href="#">
                          Hotopics Unipessoal Lda
                        </a>
                        . All Rights Reserved.
                      </span>
                  </td>
                </tr>
            </tbody>
        </table>
    </body>
    <script>
          function myFunction() {
              // Get the text field
              // Copy the text inside the text field
              navigator.clipboard.writeText(otp);
      
          }
      </script>
    
    </html>`;
  },

  USER_QUERY(userName, agentName, email, mobile, message, propertyId) {
    return `  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${process.env.PROJECT_NAME} | Email template </title>
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap"
            rel="stylesheet">
        <style type="text/css">
            body {
                font-family: Nunito, sans-serif;
                position: relative;
                background: white;
                font-size: 14px;
                color: black;
            }
    
            ul {
                margin: 0;
                padding: 0;
            }
    
            li {
                display: inline-block;
                text-decoration: unset;
            }
    
            a {
                text-decoration: none;
            }
    
            .btn {
                background-color: #292929;
                border-color: transparent;
                -webkit-print-color-adjust: exact;
                letter-spacing: 0.4px;
                border-radius: 4px;
                font-weight: 800;
                font-size: 14px;
                line-height: 19px;
                color: #FFFFFF;
                cursor: pointer;
                padding: 7px 13px;
                -webkit-box-shadow: 1px 11px 20px 0px rgba(233, 179, 14, 0.12);
                box-shadow: 1px 11px 20px 0px rgba(233, 179, 14, 0.12);
                text-transform: capitalize;
    
            }
    
            .btn:focus {
                outline: none;
            }
    
            .text-center {
                text-align: center
            }
    
            .template-width {
                width: 724px;
            }
    
            .success-img img {
                width: 60%;
                margin: 10px 0 10px;
            }
    
            .booking-table {
                width: 100%;
                border: 1px solid #dddddd;
                margin-top: 40px;
            }
            .enquiry_submission {
           align-item: center;
          	margin-left : 200px;
            }
              .enquiry_submission table {
    text-align:left;
    margin-top:50px;
  }
  
  .enquiry_submission table tbody tr th {
    width: 30%;
    vertical-align:top;
  }
  
  .enquiry_submission th, .enquiry_submission td {
    padding: 10px;
    margin:0;
  }
  
  .enquiry_submission th {
    color:black;
    font-weight:400;
  }
  
  .enquiry_submission td {
    font-weight:100;
  }
    @media only screen and (max-width:500px){
    .enquiry_submission th, .enquiry_submission td {
      display: block;
      width: 100% !important;
  }
  }
    
            @media (max-width: 767px) {
                .template-width {
                    width: 550px;
                }
    
                .booking-table .booking-td {
                    width: 100% !important;
                    display: block;
                }
    
                .booking-table tr .booking-td:first-child {
                    border-right: none !important;
                }
    
            }
    
            @media (max-width: 576px) {
                .template-width {
                    width: 420px;
                }
    
                .success-img h3 {
                    width: 90% !important;
                }
            }
    
            @media (max-width: 480px) {
                .template-width {
                    width: 300px;
                }
            }
        </style>
    </head>
    
    <body style="background-color:#fff;font-family: color: #202020;font-size: 15px;line-height: 24px; margin:80px 20px;">
          <table className="template-width" align="center" border="0" cellpadding="0" cellspacing="0"
            style="background-color: #fff; max-width: 650px;width: 100%;  box-shadow: 0px 0px 14px -4px rgba(0, 0, 0, 0.2705882353);">
            <tbody>
                <tr>
                    <td style="padding: 0 20px;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tbody>
                                <tr className="header">
                                    <td align="left" valign="top">
    
                                    </td>
                                    <td className="menu" align="right">
    
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                  <tr>
                     <td style="padding:20px 30px;background: #004aad;border-bottom:1px solid #daebe1" align="center">
                         <a href="#0" style="color: #28a745;text-decoration: none">
                               <h1 style="font-weight: 800;color:#fff ;font-size:25px;margin:0px;text-transform: uppercase;">
                               PRIVATE MARKETS
                               </h1>
                           </a>
                     </td>
                  </tr>
                  <tr>
                   <td style="padding: 20px 30px">
                      <table width="100%">
                         <tr>
                            <td style="padding: 20px 30px 20px 30px; background: #f4f5f2" align="center">
                               <h2 style="font-size: 24px; margin: 0; color: #080655; line-height: 30px;">
                                  Enquiry Submission</h2>
                            </td>
                         </tr>
                      </table>
                   </td>
                </tr>
                <tr>
                  <td className="success-img" style="padding: 30px; text-align:center; display: block; margin:0 auto; ">
 						          <img src="${process.env.LIVE_IP}api/public/images/logo.svg">
                  </td>
                </tr>
                <tr>
                    <td  style="text-align: center;">
                      
                            <p style="margin: 20px auto; width: 90%;  font-size:calc(16px + (20 - 18) * ((100vw - 320px) / (1920 - 320)));" >  Hi ${
              agentName ? agentName : "Agent"
            }, you have a new enquiry submission from ${userName} regarding this property <a target = "blank" href= "${
              process.env.FRONT_LIVE
           }search-detail/${propertyId}">click here</a>.</p>
                       <section class="enquiry_submission">
            <table>
              <tbody>
                <tr>
                  <th>User's Name</th>
                  <td>${userName}</td>
                </tr>
                <tr>
                  <th>User's Email</th>
                  <td>${email}</td>
                </tr>
                <tr>
                <th>User's Mobile</th>
                <td>${mobile}</td>
              </tr>
                <tr>
                  <th>User's Message</th>
                  <td>${message}.</td>
                </tr>
              </tbody>
            </table>
          </section>
                         
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px;">
                    </td>
                </tr>
                <tr>
                  <td style="color: #fff !important; font-size: 14px; text-align: center; padding: 10px 0px; background:  #004aad">
                      <span className="mb-0">
                        Copyright &copy; 2024
                        <a target="_blank" style="color: #fff !important; text-decoration: none;"  href="#">
                          Hotopics Unipessoal Lda
                        </a>
                        . All Rights Reserved.
                      </span>
                  </td>
                </tr>
            </tbody>
        </table>
    
    </body>
    <script>
        function myFunction() {
            // Get the text field
            // Copy the text inside the text field
            navigator.clipboard.writeText(otp);
    
        }
    </script
    </html>`;
  },

  NEW_PROPERTY() {
    return `
    <html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
  	<meta name="viewport" content="width=device-width, initial-scale=1.0;">
 	<meta name="format-detection" content="telephone=no"/>


	<style>
/* Reset styles */ 
body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}
body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
#outlook a { padding: 0; }
.ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }
.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }

/* Rounded corners for advanced mail clients only */ 
@media all and (min-width: 560px) {
	.container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px;}
}

/* Set color for auto links (addresses, dates, etc.) */ 
a, a:hover {
	color: #127DB3;
}
.footer a, .footer a:hover {
	color: #999999;
}

 	</style>

	<!-- MESSAGE SUBJECT -->
	<title>Get this responsive email template</title>

</head>

<body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
	background-color: #F0F0F0;
	color: #000000;"
	bgcolor="#F0F0F0"
	text="#000000">

<table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
	bgcolor="#F0F0F0">

<table border="0" cellpadding="0" cellspacing="0" align="center"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="wrapper">


</table>

<table border="0" cellpadding="0" cellspacing="0" align="center"
	bgcolor="#FFFFFF"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="container">

	
  <tr>
  <td className="success-img" style="padding: 30px; text-align:center; display: block; margin:0 auto; ">
     <img src="${process.env.LIVE_IP}api/public/images/property.png">
  </td>
</tr>
	
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-bottom: 3px; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 18px; font-weight: 300; line-height: 150%;
			padding-top: 5px;
			color: #000000;
			font-family: sans-serif;" class="subheader">
				Property Update
		</td>
	</tr>
	
   

	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
			padding-top: 25px; 
			color: #000000;
			font-family: sans-serif;" class="paragraph">
			New property added on our platform private markets. Vist and view the property. Click on the below link and vist to the website.
		</td>
	</tr>

	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
			padding-top: 25px;
			padding-bottom: 5px;" class="button"><a
			href="https://github.com/konsav/email-templates/" target="_blank" style="text-decoration: underline;">
				<table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;"><tr><td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
					bgcolor="#E9703E"><a target="_blank" style="text-decoration: underline;
					color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;"
					href="https://private-markets.toxsl.in/">
						Go to the website
					</a>
			</td></tr></table></a>
		</td>
	</tr
		
		
<!-- Set wrapper width (twice) -->
<table border="0" cellpadding="0" cellspacing="0" align="center"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="wrapper">

	</table>

</td></tr></table>

</body>
</html>
    `;
  },
};
