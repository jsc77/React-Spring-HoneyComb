import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../Api";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Select from "react-select";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SendMessage = ({ memberId }) => {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [board, setBoard] = useState();

  const { data: member } = useQuery("member", () => {
    return api.get("/member");
  });

  const { data: memberBoard } = useQuery("memberBoard", () => {
    return api.get(`/member/board/${member?.data.id}`);
  });

  const sendMessage = () => {
    let formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("memberId", memberId);
    formData.append("boardId", board?.value);
    api
      .post("/messages", formData)
      .then(
        toast("메세지를 전송했습니다", {
          position: "top-right",
          autoClose: 3000,
          closeOnClick: true,
          theme: "light",
        })
      )
      .then(setTitle(""), setContent(""));
  };
  return (
    <div>
      {member?.data ? (
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: 400,
            transition: {
              ease: "linear",
            },
          }}>
          <div className="flex flex-col items-center max-w-[400px] rounded overflow-hidden shadow-lg border border-orange-200 bg-white">
            <div className="bg-white rounded-xl p-4 w-[400px] h-[370px] shadow">
              <Select
                className="mb-5"
                placeholder="게시글"
                options={memberBoard?.data}
                onChange={(opt) => setBoard(opt)}
              />
              <div className="flex">
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  placeholder="제목을 입력하세요"
                  className="flex-initial bg-gray-100 rounded-xl p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full mr-2 pl-4"
                />
                <button
                  className="w-[50px] text-white h-[40px] bg-orange-400 hover:bg-blue-200 rounded-xl"
                  onClick={sendMessage}>
                  전송
                </button>
              </div>
              <textarea
                onChange={(e) => setContent(e.target.value)}
                value={content}
                placeholder="내용을 입력하세요"
                className="flex-initial bg-gray-100 rounded-xl p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full mr-2 pl-4"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: 300,
            transition: {
              ease: "linear",
            },
          }}>
          <div className="flex flex-col items-center max-w-[400px] rounded overflow-hidden shadow-lg border border-orange-200 bg-white">
            <div className="bg-white rounded-xl p-4 w-[400px] h-[370px] shadow">
              <h2 className="text-center">로그인해주세요</h2>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SendMessage;
