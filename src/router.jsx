import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NewsListPage from "./pages/NewsListPage.jsx";
import NewsDetailPage from "./pages/NewsDetailPage.jsx";
import CreateNewsPage from "./pages/CreateNewsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <NewsListPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "news/:id", element: <NewsDetailPage /> },
      { path: "news/create", element: <CreateNewsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
