import { lazy } from "react";

export const publicRoutes = [
  {
    name: "Home",
    path: "/",
    component: lazy(() => import("../pages/home")),
  },
  {
    name: "Borrowing",
    path: "/borrowing",
    component: lazy(() => import("../pages/borrowing")),
  },
  {
    name: "Portfolio",
    path: "/portfolio",
    component: lazy(() => import("../pages/portfolio")),
  },
  {
    name: "BridgeOrdinals",
    path: `/bridge`,
    component: lazy(() => import("../pages/bridgeOrdinals")),
  },
  {
    name: "Lending",
    path: `/lending`,
    component: lazy(() => import("../pages/lending")),
  },
  {
    name: "Active-Loans",
    path: `/activeloans`,
    component: lazy(() => import("../pages/active-loans")),
  },
  {
    name: "Page 404",
    path: "*",
    component: lazy(() => import("../pages/404")),
  },
];
