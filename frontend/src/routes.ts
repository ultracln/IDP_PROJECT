/**
 * Here you can add more routes as constant to be used for routing within the application.
 */
import React from 'react';

// Route enum for programmatic navigation
export enum AppRoute {
    Index = "/",
    Login = "/login",
    Register = "/register",
    Books = "/all-books",
    MyBooks = "/my-books",
    Users = "/users",
    Feedback = "/feedback",
    Transactions = "/transactions",
    Admin = "/admin"
}

// Route configuration for React Router
interface RouteConfig {
    path: string;
    element: React.ComponentType;
    private: boolean;
}

// Lazy load components with named exports
const HomePage = React.lazy(() => 
    import("./presentation/pages/HomePage").then(module => ({ default: module.HomePage }))
);
const LoginPage = React.lazy(() => 
    import("./presentation/pages/LoginPage").then(module => ({ default: module.LoginPage }))
);
const RegisterPage = React.lazy(() => 
    import("./presentation/pages/Register").then(module => ({ default: module.RegisterPage }))
);
const Feedback = React.lazy(() => 
    import("./presentation/pages/Feedback").then(module => ({ default: module.Feedback }))
);
const UsersPage = React.lazy(() => 
    import("./presentation/pages/UsersPage").then(module => ({ default: module.UsersPage }))
);
const AllBooks = React.lazy(() => 
    import("./presentation/pages/AllBooks").then(module => ({ default: module.AllBooks }))
);
const MyBooks = React.lazy(() => 
    import("./presentation/pages/MyBooks").then(module => ({ default: module.MyBooks }))
);
const UserTransactions = React.lazy(() => 
    import("./presentation/pages/UserTransactions").then(module => ({ default: module.UserTransactions }))
);
const AdminPage = React.lazy(() => 
    import("./presentation/pages/AdminPage").then(module => ({ default: module.AdminPage }))
);

export const routes: RouteConfig[] = [
    {
        path: AppRoute.Index,
        element: HomePage,
        private: false
    },
    {
        path: AppRoute.Login,
        element: LoginPage,
        private: false
    },
    {
        path: AppRoute.Register,
        element: RegisterPage,
        private: false
    },
    {
        path: AppRoute.Books,
        element: AllBooks,
        private: false
    },
    {
        path: AppRoute.MyBooks,
        element: MyBooks,
        private: false
    },
    {
        path: AppRoute.Users,
        element: UsersPage,
        private: false
    },
    {
        path: AppRoute.Feedback,
        element: Feedback,
        private: false
    },
    {
        path: AppRoute.Transactions,
        element: UserTransactions,
        private: false
    },
    {
        path: AppRoute.Admin,
        element: AdminPage,
        private: false
    }
];
