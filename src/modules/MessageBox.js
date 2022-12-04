import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { api, sendMessage } from "../Api";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { BsBellFill } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { FiMail } from "react-icons/fi";
import { BsPencilSquare } from "react-icons/bs";
import MessageModal from "../components/MessageModal";
import { AnimatePresence, motion } from "framer-motion";
import Select from "react-select";
import { BiCommentDetail } from "react-icons/bi";
import Badge from "@mui/material/Badge";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";

const MessageBox = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState();
  const [modalText, setModalText] = useState({});
  const [deleteId, setDeleteId] = useState();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [select, setSelected] = useState();
  const [board, setBoard] = useState();
  const [isSender, setIsSender] = useState();
  const [page, setPage] = useState(1);
  const [sendPage, setSendPage] = useState(1);
  const limit = 5;
  const offset = (page - 1) * limit;
  const offsetSend = (sendPage - 1) * limit;

  const [isMenuOpen, setIsMenuOpen] = useState("receive");
  const { data: member } = useQuery("member", () => {
    return api.get("/member");
  });
  const { data: memberAll } = useQuery("memberAll", () => {
    return api.get("/member/all");
  });
  const { data: memberBoard } = useQuery("memberBoard", () => {
    return api.get(`/member/board/${member?.data.id}`);
  });
  const { data: commentRead, refetch: commentRefetch } = useQuery(
    "commentRead",
    () => {
      return api.get("/comment/read");
    }
  );

  const { data: getReceivedMessage, refetch: getReceivedMessageRefetch } =
    useQuery("getReceivedMessage", async () => {
      const res = await api.get("/messages/received");
      return res;
    });

  const { data: getSendMessage, refetch: getSentMessageRefetch } = useQuery(
    "getSendMessage",
    async () => {
      return await api.get("/messages/sent");
    }
  );

  const handleModalText = (
    content,
    createdDate,
    senderEmail,
    senderName,
    title,
    senderId,
    messageId,
    boardId
  ) => {
    setDeleteId(messageId);
    setModalText({
      content,
      createdDate,
      senderEmail,
      senderName,
      title,
      senderId,
      boardId,
    });
    setShowModal(!showModal);
  };

  const deleteMessage = () => {
    if (isSender) {
      api
        .delete(`/messages/sent/${deleteId}`)
        .then((res) =>
          toast(res.data.message, {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            theme: "light",
          })
        )
        .then(getSentMessageRefetch);
    } else {
      api
        .delete(`/messages/received/${deleteId}`)
        .then((res) =>
          toast(res.data.message, {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            theme: "light",
          })
        )
        .then(getReceivedMessageRefetch);
    }
    setShowModal(!showModal);
  };

  const readAlarm = (commentId) => {
    api
      .put(`comment/alarm/${commentId}`)
      .then((res) => navigate(`/board/get/${res.data}`))
      .then(commentRefetch);
  };

  const readMessage = (messageId) => {
    api
      .put(`messages/alarm/${messageId}`)
      .then(getReceivedMessageRefetch)
      .then(messageRefetch);
  };

  const { data: messagesRead, refetch: messageRefetch } = useQuery(
    "messagesRead",
    () => {
      return api.get("/messages/read");
    }
  );

  const messageHub = (title, content, value, boardId) => {
    sendMessage(title, content, value, boardId);
    setTitle("");
    setContent("");
    setSelected("");
  };

  return (
    <main class="m-auto flex w-[450px] h-[640px]  rounded-3xl overflow-auto">
      <section class="flex flex-col w-[65px] bg-white rounded-l-3xl shadow-lg">
        <div class="w-16 mt-12 mb-20 p-4 bg-orange-600 rounded-2xl text-white">
          <BsBellFill size={30} />
        </div>
        <nav class="relative flex flex-col py-4">
          <div
            onClick={() => setIsMenuOpen("receive")}
            class="relative w-16 p-4 hover:bg-orange-400 hover:text-white border text-purple-900 rounded-2xl mb-4">
            <Badge badgeContent={messagesRead?.data.length} color="primary">
              <FiMail size={30} />
            </Badge>
          </div>
          <div
            onClick={() => setIsMenuOpen("send")}
            class="w-16 p-4 hover:bg-orange-400 hover:text-white border text-gray-700 rounded-2xl mb-4">
            <FiSend size={30} />
          </div>
          <div
            onClick={() => setIsMenuOpen("message")}
            class="w-16 p-4 hover:bg-orange-400 hover:text-white border text-gray-700 rounded-2xl mb-4">
            <BsPencilSquare size={30} />
          </div>
          <div
            onClick={() => setIsMenuOpen("comment")}
            class="w-16 p-4 hover:bg-orange-400 hover:text-white border text-gray-700 rounded-2xl mb-4">
            <Badge badgeContent={commentRead?.data.length} color="primary">
              <BiCommentDetail size={30} />
            </Badge>
          </div>
        </nav>
      </section>
      <AnimatePresence>
        {isMenuOpen == "receive" ? (
          <motion.div
            style={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ default: { ease: "linear" } }}>
            <section class="flex flex-col pt-3 w-[300px] bg-gray-50 h-full overflow-y-scroll rounded-r-3xl">
              <label class="px-3">
                <input
                  class="rounded-lg p-4 bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 w-full"
                  placeholder="Search..."
                />
              </label>
              <ul class="mt-1">
                {getReceivedMessage?.data.result
                  .slice(offset, offset + limit)
                  .map((item) => (
                    <li
                      onClick={() =>
                        handleModalText(
                          item.content,
                          item.createdDate,
                          item.senderEmail,
                          item.senderName,
                          item.title,
                          item.senderId,
                          item.messageId,
                          item.boardId,
                          setIsSender(false),
                          readMessage(item.messageId)
                        )
                      }
                      class="py-2 border-b px-3 transition hover:bg-indigo-100">
                      <p class="text-md text-gray-400">{item.createdDate}</p>
                      <div
                        className={`text-lg mr-2 px-2.5 py-0.5 rounded w-auto ${
                          item.alarmRead
                            ? "line-through text-gray-400"
                            : "text-orange-400"
                        }`}>
                        {item.title}
                      </div>
                      <div
                        className={`text-white text-sm font-medium mr-2 px-2.5 py-0.5 rounded w-auto ${
                          item.alarmRead ? "bg-gray-400" : "bg-orange-400"
                        }`}>
                        {item.senderName}
                      </div>
                    </li>
                  ))}
              </ul>
              <Pagination
                total={
                  getReceivedMessage?.data
                    ? getReceivedMessage?.data.result.length
                    : 0
                }
                limit={limit}
                page={page}
                setPage={setPage}
              />
            </section>
          </motion.div>
        ) : null}{" "}
      </AnimatePresence>
      <AnimatePresence>
        {isMenuOpen == "send" ? (
          <motion.div
            style={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ default: { ease: "linear" } }}>
            <section class="flex flex-col pt-3 w-[300px] bg-gray-50 h-full overflow-y-scroll rounded-r-3xl">
              <label class="px-3">
                <input
                  class="rounded-lg p-4 bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 w-full"
                  placeholder="Search..."
                />
              </label>
              <ul class="mt-1">
                {getSendMessage?.data.result
                  .slice(offsetSend, offsetSend + limit)
                  .map((item) => (
                    <li
                      onClick={() =>
                        handleModalText(
                          item.content,
                          item.createdDate,
                          item.senderEmail,
                          item.senderName,
                          item.title,
                          item.senderId,
                          item.messageId,
                          item.boardId,
                          setIsSender(true)
                        )
                      }
                      class="py-2 border-b px-3 transition hover:bg-indigo-100">
                      <p class="text-md text-gray-400">{item.createdDate}</p>
                      <h3 class="text-lg font-semibold">{item.title}</h3>
                      <div class="bg-gray-400 text-white text-sm font-medium mr-2 px-2.5 py-0.5 rounded ">
                        {item.senderName}
                      </div>
                    </li>
                  ))}
              </ul>
              <Pagination
                total={
                  getSendMessage?.data ? getSendMessage?.data.result.length : 0
                }
                limit={limit}
                page={sendPage}
                setPage={setSendPage}
              />
            </section>
          </motion.div>
        ) : null}{" "}
      </AnimatePresence>
      <AnimatePresence>
        {isMenuOpen == "message" ? (
          <motion.div
            style={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ default: { ease: "linear" } }}>
            <section class="flex flex-col p-3 w-[300px] bg-gray-50 h-full overflow-y-scroll rounded-r-3xl">
              <Select
                className="mb-5"
                placeholder="수신인"
                options={memberAll?.data}
                onChange={(opt) => setSelected(opt)}
              />
              <Select
                className="mb-5"
                placeholder="게시글"
                options={memberBoard?.data}
                onChange={(opt) => setBoard(opt)}
              />
              <button
                className="mt-4 mb-10 h-10 text-orange-400 border border-orange-400 hover:text-white hover:bg-orange-400 rounded-xl"
                onClick={() =>
                  messageHub(title, content, select?.value, board?.value)
                }>
                전송
              </button>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                placeholder="제목을 입력하세요"
                className="flex-initial bg-gray-100 rounded-xl p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full mr-2 pl-4"
              />
              <textarea
                onChange={(e) => setContent(e.target.value)}
                value={content}
                rows="4"
                placeholder="내용을 입력하세요"
                className="flex-initial bg-gray-100 rounded-xl p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full mr-2 pl-4"
              />
            </section>
          </motion.div>
        ) : null}{" "}
      </AnimatePresence>
      <AnimatePresence>
        {isMenuOpen == "comment" ? (
          <motion.div
            style={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ default: { ease: "linear" } }}>
            <section class="flex flex-col pt-3 w-[300px] bg-gray-50 h-full overflow-y-scroll rounded-r-3xl">
              <label class="px-3">
                <input
                  class="rounded-lg p-4 bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 w-full"
                  placeholder="Search..."
                />
              </label>
              <ul class="mt-1">
                {commentRead?.data.map((item) => (
                  <li
                    onClick={() => readAlarm(item.id)}
                    class="py-2 border-b px-3 transition hover:bg-indigo-100">
                    <p class="text-md text-gray-400">{item.createdDate}</p>
                    <h3 class="text-lg font-semibold">
                      <a
                        href={`/member/${item.member.id}`}
                        className="bg-blue-800 hover:bg-blue-200 text-white text-sm font-medium mr-2 px-2.5 py-0.5 rounded ">
                        {item.member.name}
                      </a>
                      님이 답변하셨습니다.
                    </h3>
                    <div class="text-md italic text-gray-400">
                      <a
                        href={`/board/${item.board.category.id}`}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ">
                        {item.board.category.name}
                      </a>
                      {item.board.title}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </motion.div>
        ) : null}{" "}
      </AnimatePresence>

      {showModal && (
        <MessageModal
          onPress={deleteMessage}
          showModal={showModal}
          setShowModal={setShowModal}
          modalText={modalText}
          isSender={isSender}
        />
      )}
    </main>
  );
};
export default MessageBox;
