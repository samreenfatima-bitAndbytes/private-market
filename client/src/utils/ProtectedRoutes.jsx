/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import { Navigate, Outlet, useLocation } from "react-router-dom";
import useRole from "../hooks/useRole";
import useToken from "../hooks/useToken";
import { constant } from "./constant";

/** Agent landing (listings / properties) */
const AGENT_HOME = "/customer/property-list";
/** Buyer landing (sidebar + My Files — not bare search home) */
const CUSTOMER_HOME = "/customer/file-list";
/** Admin landing */
const ADMIN_HOME = "/admin/dashboard";

/**
 * Guards /customer/* — buyers (2) and agents (3) share these routes.
 * Admins are sent to the admin panel.
 */
export const RealStateAgentAuth = () => {
  const token = useToken();
  const role = useRole();

  if (token) {
    if (role == constant.ADMIN) {
      return <Navigate to={ADMIN_HOME} replace={true} />;
    }
    // CUSTOMER + REAL_STATE_AGENT
    return <Outlet />;
  }
  return <Navigate to="/" replace={true} />;
};

/**
 * Legacy helper (unused in App.jsx) — keep behaviour consistent.
 */
export const CustomerAuth = () => {
  const token = useToken();
  const role = useRole();

  if (token) {
    if (role == constant.ADMIN) {
      return <Navigate to={ADMIN_HOME} replace={true} />;
    }
    if (role == constant.REAL_STATE_AGENT) {
      return <Navigate to={AGENT_HOME} replace={true} />;
    }
    return <Outlet />;
  }
  return <Navigate to="/" replace={true} />;
};

/**
 * Guards /admin/* — admin only.
 */
export const AdminAuth = () => {
  const token = useToken();
  const role = useRole();

  if (token) {
    if (role == constant.CUSTOMER) {
      return <Navigate to={CUSTOMER_HOME} replace={true} />;
    }
    if (role == constant.REAL_STATE_AGENT) {
      return <Navigate to={AGENT_HOME} replace={true} />;
    }
    return <Outlet />;
  }
  return <Navigate to="/" replace={true} />;
};

/**
 * Public pages — keep home + search reachable while logged in so marketplace
 * search still works; only bounce away from other public shells (e.g. profile).
 */
export const PublicAuth = () => {
  const token = useToken();
  const role = useRole();
  const location = useLocation();
  const path = location.pathname || "/";
  const allowWhileLoggedIn =
    path === "/" ||
    path === "" ||
    path === "/search" ||
    path.startsWith("/search-detail") ||
    path === "/product-list";

  if (token && !allowWhileLoggedIn) {
    if (role == constant.ADMIN) {
      return <Navigate to={ADMIN_HOME} replace={true} />;
    }
    if (role == constant.REAL_STATE_AGENT) {
      return <Navigate to={AGENT_HOME} replace={true} />;
    }
    return <Navigate to={CUSTOMER_HOME} replace={true} />;
  }
  return <Outlet />;
};
