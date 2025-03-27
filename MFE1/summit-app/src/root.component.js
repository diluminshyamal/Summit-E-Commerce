import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import AuthRoute from "./AuthRoute";
import HomeScreen from "./screens/HomeScreen";
import ProductsView from "./components/ProductsView";

export default function App() {
  const userType = localStorage.getItem("userType");
  const [approvePermission, setApprovePermission] = useState(false);
  const [removePermission, setRemovePermission] = useState(false);

  useEffect(() => {
    if (userType == "steward") {
      setApprovePermission(true);
      setRemovePermission(true);
    } else if (userType == "steward" || userType == "supplier") {
      setRemovePermission(true);
    }
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <AuthRoute>
                <HomeScreen
                  approvePermission={approvePermission}
                  removePermission={removePermission}
                />
              </AuthRoute>
            }
          />
          <Route
            path="/product/:productId"
            element={
              <AuthRoute>
                <ProductsView
                  approvePermission={approvePermission}
                  removePermission={removePermission}
                />
              </AuthRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
