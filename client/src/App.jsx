import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/queryClient";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import ScrollToTop from "./components/UI/ScrollToTop";
import ErrorPage from "./pages/ErrorPage";
import ToastContainer from "./components/UI/ToastContainer";
import { publicRoutes } from "./routes";
import { userRoutes } from "./routes/userRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import UserRoute from "./routes/protectedRoutes/UserRoute";
import AdminRoute from "./routes/protectedRoutes/AdminRoute";
import PublicRouteGuard from "./routes/publicRoutes/PublicRoute";
import CookieConsent from "./components/UI/CookieConsent";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          {/* Header might be checking auth status */}
          <Header />
          <main className="flex-1 pt-20">
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRouteGuard />}>
                {publicRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>

              {/* This guard might be firing multiple times */}
              <Route element={<UserRoute />}>
                {userRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                {adminRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>

              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer />
        <CookieConsent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
