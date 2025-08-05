import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import EventList from "@/pages/EventList";
import Settings from "@/pages/Settings";
import UserManual from "@/pages/UserManual";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/manual" element={<UserManual />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}
