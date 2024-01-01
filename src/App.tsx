import { getAuth, onAuthStateChanged } from "firebase/auth";
import Router from "./Router/router";
import Layout from "./components/Layout";
import { app } from "./firebaseApp";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/loader/Loader";

function App() {
  const auth = getAuth(app);
  console.log(auth);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );

  const [init, setInit] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);

  // useEffect(() => {
  //   auth.signOut();
  // }, []);

  return (
    <Layout>
      <ToastContainer
        theme="dark"
        autoClose={1000}
        hideProgressBar
        newestOnTop
      />
      {/* <Loader /> */}
      {init ? <Router isAuthenticated={isAuthenticated} /> : "loading"}
    </Layout>
  );
}
export default App;
