import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Createaccount from "./partials/createaccount";
import Create from "./partials/create";
import Found from "./partials/found";
import Login from "./partials/login";
import Lost from "./partials/lost";
import Notifications from "./partials/notifications";
import Mylist from "./partials/mylist";
import Recommendation from "./partials/Recommendation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./partials/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <UserProvider>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/lost" element={<Lost />} />
        <Route path="/found" element={<Found />} />
        <Route path="/create" element={<Create />} />
        <Route path="/createaccount" element={<Createaccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/mylist" element={<Mylist />} />
        <Route path="/recommend/:itemId" element={<Recommendation />} />
      </Routes>
    </UserProvider>
  </HashRouter>,
);
