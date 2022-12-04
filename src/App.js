import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./modules/Home";
import List from "./modules/List";
import Signin from "./modules/Signin";
import Board from "./modules/Board";
import { ToastContainer, toast } from "react-toastify";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Navbar from "./components/Navbar";
import PostBoard from "./components/PostBoard";
import Profile from "./modules/Profile";
import MessageBox from "./modules/MessageBox";
import { getToken } from "./Api";

export default function App() {
  const location = useLocation();
  getToken();

  return (
    <TransitionGroup className="transitions-wrapper">
      <Navbar />
      <div className="mt-28"></div>
      <ToastContainer />
      <CSSTransition key={location.pathname} classNames={"right"} timeout={300}>
        <Routes location={location}>
          <Route
            path="/"
            element={<Home style={{ position: "absolute" }} />}></Route>
          <Route
            path="/signin"
            element={<Signin style={{ position: "absolute" }} />}></Route>
          <Route
            path="board/:id"
            element={<List style={{ position: "absolute" }} />}></Route>
          <Route
            path="/board/get/:id"
            element={<Board style={{ position: "absolute" }} />}></Route>
          <Route
            path="/board/post/:id"
            element={<PostBoard style={{ position: "absolute" }} />}></Route>
          <Route
            path="/member/:id"
            element={<Profile style={{ position: "absolute" }} />}></Route>
          <Route
            path="/messageBox"
            element={<MessageBox style={{ position: "absolute" }} />}></Route>
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}
