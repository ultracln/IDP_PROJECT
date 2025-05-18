import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "routes";

/**
 * The object returned can be used to navigate within the application on various routes.
 */
export const useAppRouter = () => {
  const navigate = useNavigate();

  const redirectToHome = useCallback(
    () => navigate(AppRoute.Index),
    [navigate]
  );

  const redirectToLogin = useCallback(
    () => navigate(AppRoute.Login),
    [navigate]
  );

  const redirectToRegister = useCallback(
    () => navigate(AppRoute.Register),
    [navigate]
  );

  const redirectToBooks = useCallback(
    () => navigate(AppRoute.Books),
    [navigate]
  );

  const redirectToUsers = useCallback(
    () => navigate(AppRoute.Users),
    [navigate]
  );

  const redirectToFeedback = useCallback(
    () => navigate(AppRoute.Feedback),
    [navigate]
  );

  return {
    redirectToHome,
    redirectToLogin,
    redirectToRegister,
    redirectToBooks,
    redirectToUsers,
    redirectToFeedback,
    navigate
  };
};
