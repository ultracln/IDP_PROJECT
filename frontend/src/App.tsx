import { UserRoleEnum } from "@infrastructure/apis/client";
import { useOwnUserHasRole } from "@infrastructure/hooks/useOwnUser";
import { AppIntlProvider } from "@presentation/components/ui/AppIntlProvider";
import { ToastNotifier } from "@presentation/components/ui/ToastNotifier";
import { HomePage } from "@presentation/pages/HomePage";
import { LoginPage } from "@presentation/pages/LoginPage";
import { RegisterPage } from "@presentation/pages/Register";
import { UserFilesPage } from "@presentation/pages/UserFilesPage";
import { UsersPage } from "@presentation/pages/UsersPage";
import { AllBooks } from "@presentation/pages/AllBooks";
import { MyBooks } from "@presentation/pages/MyBooks";
import { Feedback } from "@presentation/pages/Feedback";
import { Route, Routes } from "react-router-dom";
import { routes } from "routes";
import { useInterceptor } from "@infrastructure/hooks/useInterceptor";
import React, { Suspense } from 'react';

export function App() {
  const isAdmin = useOwnUserHasRole(UserRoleEnum.Admin);

  useInterceptor({
    onRequest: ([resource, config = {}]) => {
      let url: string;
      if (typeof resource === "string") {
        url = resource;
      } else if (resource instanceof Request) {
        url = resource.url;
      } else if (resource instanceof URL) {
        url = resource.toString();
      } else {
        url = "";
      }

      if (url.includes("/login") || url.includes("/register")) {
        return [resource, config];
      }

      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        ...(config.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      return [
        resource,
        {
          ...config,
          headers,
        },
      ];
    },
  });

  return (
    <AppIntlProvider>
      <ToastNotifier />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                !route.private || (route.private && isAdmin) ? (
                  <route.element />
                ) : null
              }
            />
          ))}
        </Routes>
      </Suspense>
    </AppIntlProvider>
  );
}
