import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api, sendMessage } from "../Api";
import { FiSend } from "react-icons/fi";
import { toast } from "react-toastify";

export default function MessageModal({
  onPress,
  setShowModal,
  showModal,
  modalText,
  isSender,
}) {
  const [title, setTitle] = useState();
  const [content, setContent] = useState();

  const messageHub = (title, content, value) => {
    let formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("memberId", value);
    api.post("/messages", formData).then(
      toast("메세지를 전송했습니다", {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        theme: "light",
      })
    );
    setTitle("");
    setContent("");
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <section class="w-[500px] px-4 flex flex-col bg-white rounded-3xl">
              <div class="flex justify-between items-center h-24 border-b-2 mb-8">
                <div class="flex space-x-4 items-center">
                  <div class="flex flex-col">
                    <h3 class="font-semibold text-lg text-orange-400">
                      {modalText.senderName}
                    </h3>
                    <p class="text-light text-gray-400">
                      {modalText.senderEmail}
                    </p>
                  </div>
                </div>
              </div>
            </section>
            {/*body*/}
            <section className="m-4">
              <h1 class="font-bold text-2xl">{modalText.title}</h1>
              <article class="mt-8 text-gray-500 leading-7 tracking-wider">
                <p>{modalText.content}</p>
              </article>
            </section>
            {isSender == false ? (
              <div className="m-8">
                <section class="mt-6 rounded-xl bg-gray-50 mb-3">
                  <h1 className="text-xl text-center bg-orange-400 text-white rounded">
                    답장
                  </h1>
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
                <div
                  onClick={() => messageHub(title, content, modalText.senderId)}
                  class="p-4 w-14 hover:bg-indigo-600 hover:text-white border text-indigo-600 rounded-2xl mb-4">
                  <FiSend size={20} />
                </div>
              </div>
            ) : (
              <section class="w-[500px] px-4 flex flex-col bg-white rounded-3xl">
                <div class="flex justify-between items-center h-24 border-t-2 mb-8">
                  <div class="flex space-x-4 items-center">
                    <div class="flex flex-col">
                      <h2 className="bg-orange-400 text-white rounded">
                        받으시는 분
                      </h2>
                      <h3 class="font-semibold text-lg text-orange-400">
                        {modalText.receiverName}
                      </h3>
                      <p class="text-light text-gray-400">
                        {modalText.receiverEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <Link
                className="text-yellow-500 hover:text-white hover:bg-yellow-500 rounded-lg px-6 py-2 text-sm outline-none mr-1 mb-1"
                type="button"
                to={`/board/get/${modalText.boardId}`}>
                의뢰글로 이동
              </Link>
              <button
                className="text-yellow-500 hover:text-white hover:bg-yellow-500 rounded-lg px-6 py-2 text-sm outline-none mr-1 mb-1"
                type="button"
                onClick={() => setShowModal(!showModal)}>
                취소
              </button>
              <button
                className="bg-red-600 text-white text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={onPress}>
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
