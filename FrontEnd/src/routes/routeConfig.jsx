import Home from "../pages/Home/Home";
import { MarketingHub, marketingRoutes } from "../config/marketingRoutes";

export const routes = [
  {
    path: "/",
    element: <Home />,
    children: [
      // ========== MARKETING HUB ==========
      {
        path: "marketing",
        element: <MarketingHub />,
        children: [
          ...marketingRoutes.map((route) => {
            const Component = route.component;
            return {
              path: route.path,
              element: <Component />,
            };
          }),

          // Default route: /marketing → first tab
          {
            index: true,
            element: (() => {
              const DefaultComponent = marketingRoutes[0].component;
              return <DefaultComponent />;
            })(),
          },
        ],
      },
    ],
  },
];
