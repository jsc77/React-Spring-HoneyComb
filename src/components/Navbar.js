import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { api, getReload } from "../Api";
import { FiBell } from "react-icons/fi";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import jwt_decode from "jwt-decode";
import { MdOutlineGeneratingTokens } from "react-icons/md";
import Divider from "@mui/material/Divider";
import { ToastContainer, toast } from "react-toastify";
import { FiDelete } from "react-icons/fi";
import logo from "../img/honeycomb.png";
import { BiCommentDetail } from "react-icons/bi";

const clearLocalStorage = () => {
  localStorage.clear();
  window.location.reload();
};

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const exp = localStorage.getItem("exp");
  const [tokenDate, setTokenDate] = useState();

  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      const expDate =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        "   /   " +
        date.getHours() +
        "시" +
        date.getMinutes() +
        "분";
      localStorage.setItem("exp", expDate);
      setTokenDate(date);
    } else {
      if (localStorage.getItem("refresh")) {
        localStorage.removeItem("refresh");
      } else {
        localStorage.setItem("refresh", "1");
        window.location.reload();
      }
    }
  }, [token]);

  const now = new Date();
  if (tokenDate && now.getTime() > tokenDate.getTime()) {
    if (tokenDate.getTime()) {
      clearLocalStorage().then(() => {
        window.location.reload();
      });
    }
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isMenuOpen, setIsMenuOpen] = useState({});
  const toggleMenu = (id) => {
    setIsMenuOpen((prevIsMenuOpen) => ({
      ...prevIsMenuOpen,
      [id]: !prevIsMenuOpen[id],
    }));
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { data: member } = useQuery("member", () => {
    return api.get("/member");
  });
  const { data: commentRead, refetch: commentRefetch } = useQuery(
    "commentRead",
    () => {
      return api.get("/comment/read");
    }
  );
  const { data: messagesRead, refetch: messageRefetch } = useQuery(
    "messagesRead",
    () => {
      return api.get("/messages/read");
    }
  );
  const { data: category } = useQuery("category", () => {
    return api.get("/category");
  });
  const menuAnimation = {
    hidden: {
      opacity: 0,
      height: 0,
      padding: 0,
      transition: { duration: 0.3, when: "afterChildren" },
    },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
      },
    },
  };
  const menuItemAnimation = {
    hidden: (i) => ({
      padding: 0,
      opacity: 0,
      x: "-100%",
      transition: {
        duration: (i + 1) * 0.1,
      },
    }),
    show: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        duration: (i + 1) * 0.1,
      },
    }),
  };

  const readAlarm = (commentId) => {
    api
      .put(`comment/alarm/${commentId}`)
      .then((res) => navigate(`/board/get/${res.data}`))
      .then(commentRefetch);
  };

  return (
    <div className="fixed bg-white  top-0 z-30 py-2.5 w-full border-b border-gray-200 ">
      <nav>
        <div className="container flex flex-wrap items-center">
          <Link to={`/`}>
            <img className="m-1 h-[40px] w-[40px]" src={logo} />
          </Link>
          {exp && (
            <div className="bg-orange-500 rounded text-white flex fixed bottom-0 right-0">
              <MdOutlineGeneratingTokens size={30} />
              토큰만료: {exp}
            </div>
          )}

          <div className="fixed right-0 top-3">
            {member ? (
              <div className="flex">
                <div className="text-center">
                  <div>{member?.data.name}님 환영합니다</div>
                  <Link to={`/member/${member?.data.id}`}>
                    <span className="rounded p-1 text-orange-400 hover:text-white hover:bg-orange-400">
                      내 프로필
                    </span>
                  </Link>{" "}
                </div>
                <IconButton
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}>
                  <button
                    type="button"
                    className="inline-flex relative items-center p-3 text-sm font-medium text-center text-white bg-yellow-300 rounded-lg hover:bg-yellow-800">
                    <FiBell size={20} />
                    <div className="inline-flex absolute -top-2 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900">
                      {commentRead?.data.length + messagesRead?.data.length}
                    </div>
                  </button>
                </IconButton>
                <button
                  onClick={() => clearLocalStorage()}
                  className=" text-white bg-yellow-400 hover:bg-orange-400 font-medium rounded-lg text-sm p-2 m-2 text-center">
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                type="button"
                className="text-white bg-yellow-400 hover:bg-orange-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-0">
                <div>로그인해주세요</div>
              </Link>
            )}
          </div>
          <div>
            <ul className="flex space-x-4 mt-0 text-sm font-medium border-0 bg-white">
              {category?.data?.map((route, index) => {
                if (route.children) {
                  return (
                    <li className="menu w-[120px] text-white text-center  ">
                      <div
                        onClick={() => toggleMenu(route.id)}
                        className="bg-yellow-500 rounded">
                        {/* <div className="icon">{route.icon}</div> */}
                        {route.name}
                      </div>
                      <AnimatePresence>
                        {isMenuOpen[route.id] && (
                          <motion.div
                            variants={menuAnimation}
                            initial="hidden"
                            animate="show"
                            exit="hidden">
                            {route.children.map((subRoute, i) => (
                              <Link to={`/board/${subRoute.id}`}>
                                <motion.div
                                  onClick={() =>
                                    window.localStorage.setItem("pageNumber", 1)
                                  }
                                  className=" rounded text-yellow-500 hover:bg-yellow-300 hover:text-white"
                                  variants={menuItemAnimation}
                                  key={i}
                                  custom={i}>
                                  {subRoute.name}
                                </motion.div>
                              </Link>
                            ))}
                          </motion.div>
                        )}{" "}
                      </AnimatePresence>
                    </li>
                  );
                } else {
                  return (
                    <Link
                      to={`/board/${route.id}`}
                      key={index}
                      className={({ isActive }) => isActive && "active"}>
                      {route.name}
                    </Link>
                  );
                }
              })}
            </ul>
          </div>
        </div>
      </nav>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <div className="text-center m-auto mb-2  bg-orange-400 text-white w-[200px] rounded">
          알림판
        </div>
        <Divider />
        {commentRead?.data.map((i) => {
          return (
            <div>
              <MenuItem onClick={() => readAlarm(i.id)}>
                <div>
                  <span className=" bg-orange-100 text-orange-400 text-xs font-medium px-2.5 py-0.5 rounded">
                    {i.createdDate}
                  </span>
                  <div>
                    <a
                      href={`/member/${i.member.id}`}
                      className="bg-blue-800 hover:bg-blue-200 text-white text-sm font-medium mr-2 px-2.5 py-0.5 rounded ">
                      {i.member.name}
                    </a>
                    님이 답변하셨습니다.
                  </div>
                  <div>
                    <a
                      href={`/board/${i.board.category.id}`}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ">
                      {i.board.category.name}
                    </a>
                    <span className="text-orange-400">{i.board.title}</span>
                  </div>
                </div>
              </MenuItem>
              <Divider />
            </div>
          );
        })}
        {messagesRead?.data.map((item) => {
          return (
            <div className="flex">
              <MenuItem onClick={() => navigate("/messagebox")}>
                <div>
                  <span className=" bg-orange-100 text-orange-400 text-xs font-medium px-2.5 py-0.5 rounded">
                    {item.createdDate}
                  </span>
                  <div className="flex">
                    <Link
                      to={`/member/${item.sender.id}`}
                      className="bg-blue-800 hover:bg-blue-200 text-white text-sm font-medium mr-2 px-2.5 py-0.5 rounded ">
                      {item.sender.name}
                    </Link>
                    님에게서 메세지가 도착했습니다.
                  </div>

                  <span className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ">
                    메세지
                  </span>
                  <span className="text-orange-400">{item.title}</span>
                </div>
              </MenuItem>
              <FiDelete
                onClick={() =>
                  api.put(`messages/alarm/${item.id}`).then(messageRefetch)
                }
                size={30}
                className="m-auto cursor-pointer rounded-lg text-red-500 hover:bg-red-500  hover:text-white"
              />
            </div>
          );
        })}
        <Divider />
        <div className="mt-2"></div>
        <button
          onClick={() => navigate("/messagebox")}
          class="m-auto bg-yellow-400 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded items-center flex">
          <BiCommentDetail />
          메일박스
        </button>
      </Menu>
    </div>
  );
};

export default Navbar;
