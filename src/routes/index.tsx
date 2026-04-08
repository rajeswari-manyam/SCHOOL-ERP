import { createBrowserRouter } from "react-router-dom";

import { lazy } from "react";

const AuthFeaturePage = lazy(() => import("../features/auth/FeaturePage"));

export const appRouter = createBrowserRouter([
  {
    path: "/login",
    element: <AuthFeaturePage />,
  },
  // ...map ROUTES to route objects with guards
]);
