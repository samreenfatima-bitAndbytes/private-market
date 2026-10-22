/**
@copyright : Hotopics Unipessoal Lda. < www.toxsl.com >
@author    : Shiv Charan Panjeta 
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of Hotopics Unipessoal Lda. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import React from "react";
import * as FaIcons from "react-icons/fa";
export const SidebarData = [
  {
    icon: <FaIcons.FaHome />,
    title: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: <FaIcons.FaUsers />,
    title: "Users",
    path: "/admin/user-list",
  },
  {
    icon: <FaIcons.FaProductHunt />,
    title: "Product",
    path: "/admin/product-list",
  },
  {
    icon: <FaIcons.FaHotel />,
    title: "Property Management",
    iconClosed: <FaIcons.FaAngleDown />,
    iconOpened: <FaIcons.FaAngleUp />,

    subNav: [
      {
        icon: <FaIcons.FaPlus />,
        title: "Property type",
        path: "/admin/property-type",
      },

      {
        icon: <FaIcons.FaHotel />,
        title: "Property",
        path: "/admin/property-list",
      },
    ],
  },
  {
    icon: <FaIcons.FaBoxOpen />,
    title: "Order",
    path: "/admin/order-list",
  },
  {
    icon: <FaIcons.FaCreditCard />,
    title: "Payment",
    path: "/admin/payment-list",
  },
  {
    icon: <FaIcons.FaQuestion />,
    title: "Message Queue",
    path: "/admin/message-queue",
  },
  {
    icon: <FaIcons.FaHistory />,
    title: "Logger",
    iconClosed: <FaIcons.FaAngleDown />,
    iconOpened: <FaIcons.FaAngleUp />,

    subNav: [
      {
        icon: <FaIcons.FaQuestion />,
        title: "Error Logs",
        path: "/admin/error-logs",
      },
      {
        icon: <FaIcons.FaEnvelope />,
        title: "Email Queue",
        path: "/admin/email-queue",
      },
      {
        icon: <FaIcons.FaHistory />,
        title: "Login Activity",
        path: "/admin/login-activity",
      },
    ],
  },

  {
    icon: <FaIcons.FaCogs />,
    title: "Settings",
    iconClosed: <FaIcons.FaAngleDown />,
    iconOpened: <FaIcons.FaAngleUp />,

    subNav: [
      {
        icon: <FaIcons.FaEnvira />,
        title: "CMS",
        path: "/admin/cms-list",
      },
      {
        icon: <FaIcons.FaQuestion />,
        title: "FAQ",
        path: "/admin/faq-list",
      },

      {
        icon: <FaIcons.FaPhoneAlt />,
        title: "Contact Us",
        path: "/admin/contact-list",
      },
    ],
  },
];
