/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import { constant } from "./constant";

export const checkAdminState = (state) => {
  switch (state) {
    case constant.ACTIVE:
      return <span className="badge bg-success">Active</span>;
    case constant?.INACTIVE:
      return <span className="badge bg-warning">In-Active</span>;
    case constant?.DELETE:
      return <span className="badge bg-danger">Delete</span>;
    case constant?.REQUEST:
      return <span className="badge bg-info">Requested</span>;
      case constant?.BLOCK:
        return <span className="badge bg-danger">Block</span>;
    default:
      break;
  }
};
