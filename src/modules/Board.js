import React, { useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../Api";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import EditorComponent from "../components/EditorComponent";
import { BiStar, BiCommentDetail, BiUser } from "react-icons/bi";
import { BsStarFill } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import { FcDeleteDatabase } from "react-icons/fc";
import { Badge } from "@nextui-org/react";
import ModalButton from "../components/ModalButton";

const Board = () => {
  const [deleteId, setDeleteId] = useState();
  const [showModal, setShowModal] = useState();

  const ref = useRef(null);
  const cardVariants = {
    offscreen: {
      y: 200,
    },
    onscreen: {
      y: 20,
      transition: {
        type: "spring",
        bounce: 0.6,
        duration: 0.8,
      },
    },
  };
  const navigate = useNavigate();
  let { id } = useParams();
  const [text, setText] = useState();
  const { data: member } = useQuery("member", () => {
    return api.get("/member");
  });
  const { data: board, refetch: boardRefetch } = useQuery("board", async () => {
    return api.get(`/board/get/${id}`);
  });

  const { data: comment, refetch: commentRefetch } = useQuery(
    "comment",
    async () => {
      return api.get(`/comment/${id}`);
    }
  );
  const commentRecommendation = (e, commentId) => {
    e.preventDefault();
    if (member?.data) {
      api.post(`/comment/${commentId}/recommendation`).then(commentRefetch);
    } else {
      toast.warn("추천하시려면 로그인 하셔야합니다.", {
        position: "top-left",
        autoClose: 3000,
        closeOnClick: true,
        theme: "colored",
      });
    }
  };
  const deleteBoard = () => {
    api.delete(`/board/${id}/delete`).then(() => {
      navigate(-1);
    });
  };
  const handleDeleteComment = (id) => {
    setDeleteId(id);
    setShowModal(!showModal);
  };
  const deleteComment = () => {
    api.delete(`/comment/${deleteId}/delete`).then(commentRefetch);
    setShowModal(!showModal);
  };
  const createComment = () => {
    if (member?.data) {
      let formData = new FormData();
      formData.append("text", text);
      api
        .post(`/comment/${id}`, formData)
        .then(commentRefetch)
        .then(
          toast.warn("댓글을 작성했습니다.", {
            position: "top-left",
            autoClose: 3000,
            closeOnClick: true,
            theme: "colored",
          })
        );
    } else {
      toast.warn("댓글을 작성하시려면 로그인 하셔야합니다.", {
        position: "top-left",
        autoClose: 3000,
        closeOnClick: true,
        theme: "colored",
      });
    }
  };

  return (
    <div>
      {showModal && (
        <ModalButton
          onPress={deleteComment}
          showModal={showModal}
          setShowModal={setShowModal}
          modalText={"삭제하시겠습니까?"}
        />
      )}
      <main className="bg-white m-5 p-2  border border-green-900	 rounded-2xl	cardShadow">
        <h2
          className="text-4xl font-semibold text-gray-800 leading-tight"
          ref={ref}>
          {board?.data.title}
        </h2>
        <div className="flex">
          {board?.data?.boardTagMaps.map((item) => {
            return (
              <div class="ml-1 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-orange-200 text-orange-700 rounded-full">
                {item.tag.name}
              </div>
            );
          })}
        </div>
        <div className="flex lg:space-x-12">
          <div className="px-4 lg:px-0 mt-12 text-lg w-full lg:w-3/4">
            <div dangerouslySetInnerHTML={{ __html: board?.data.text }}></div>
          </div>
        </div>
        <div className="flex">
          <Link
            to={`/member/${board?.data?.member.id}`}
            className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 rounded-lg p-2 text-center inline-flex items-center text-sm">
            <BiUser size={20} />
            {board?.data?.member.name}
          </Link>
          {member?.data.name == board?.data.member.name && (
            <button
              className="bg-red-400 m-1 text-white active:bg-red-500 px-2 rounded shadow hover:shadow-lg outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={() => deleteBoard()}>
              <FcDeleteDatabase size={30}>삭제</FcDeleteDatabase>
            </button>
          )}
        </div>
      </main>

      {comment?.data.map((i) => (
        <motion.div
          variants={cardVariants}
          className="card-container cardShadow bg-white"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.15 }}>
          <div key={i.id}>
            <div dangerouslySetInnerHTML={{ __html: i.text }}></div>
            <hr />
            <div className="flex">
              <Link
                onClick={() => {
                  ref.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest",
                  });
                }}
                to={`/member/${i.member.id}`}
                className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 rounded-lg p-2 text-center inline-flex items-center text-sm">
                <BiUser size={20} />
                <p>{i.member.name}</p>
              </Link>
              {member?.data.name == i.member.name && (
                <button
                  className="justify-end bg-red-400 m-1 text-white active:bg-red-500 px-2 rounded shadow hover:shadow-lg outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleDeleteComment(i.id)}>
                  <FcDeleteDatabase size={30}>삭제</FcDeleteDatabase>
                </button>
              )}
              <div className="flex text-orange-400 ">
                <button onClick={(e) => commentRecommendation(e, i.id)}>
                  {i.recommendations.some(
                    (x) => x.member.id === member?.data.id
                  ) ? (
                    <BsStarFill color="gold" size={30} />
                  ) : (
                    <BiStar color="gold" size={30} />
                  )}
                </button>
                <h2 className="font-bold rounded mt-1 p-1">
                  {i.recommendations.length}
                </h2>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      <EditorComponent text={text} setText={setText} />
      <div className="flex flex-col items-center">
        <button
          onClick={createComment}
          class="bg-yellow-400 hover:bg-orange-400 text-white font-bold p-3 rounded items-center flex">
          <BiCommentDetail />
          답변달기
        </button>
      </div>
    </div>
  );
};

export default Board;
