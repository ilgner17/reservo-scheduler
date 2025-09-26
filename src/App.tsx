import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import Resources from "@/pages/Resources";
import NewBooking from "@/pages/NewBooking";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import PublicBooking from "@/pages/PublicBooking";
import TestWebhook from "@/pages/TestWebhook";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/resources" element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            } />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/booking/:slug" element={<PublicBooking />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/new-booking" element={
              <ProtectedRoute>
                <NewBooking />
              </ProtectedRoute>
            } />
            <Route path="/test-webhook" element={
              <ProtectedRoute>
                <TestWebhook />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;