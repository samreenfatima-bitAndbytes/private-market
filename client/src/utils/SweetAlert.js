/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import Swal from "sweetalert2";
export const toastAlert = (icon, title) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: 3000,
  });
};
export const showInformation = (title) => {
  Swal.fire({
    title: title,
    confirmButtonColor: "linear-gradient(90deg, #653de6 0%, #fc5185 100%)",
    confirmButtonText: "تمام",
  });
};
