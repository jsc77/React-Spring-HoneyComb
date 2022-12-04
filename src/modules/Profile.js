import React, { useState } from "react";
import { api } from "../Api";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@nextui-org/react";
import { BiStar, BiCommentDetail, BiUser } from "react-icons/bi";
import SendMessage from "../components/SendMessage";

const Profile = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const [messageToggle, setMessageToggle] = useState();
  const { data: member } = useQuery("member", () => {
    return api.get("/member");
  });
  const { data: profile } = useQuery("profile", () => {
    return api.get(`/member/${id}`);
  });

  return (
    <div className="flex items-center justify-center mt-12 ">
      {profile?.data ? (
        <div className="max-w-sm rounded overflow-hidden shadow-lg border border-orange-200 bg-white">
          <div className="pt-3 pb-5 px-5 flex flex-col items-center">
            <img
              className="rounded-lg "
              src={profile.data.picture}
              alt="프로필 사진"
            />
            <p className="font-bold text-3xl text-orange-400 m-4">
              {profile.data.name}
            </p>
            <p className="text-gray-500 mb-2">{profile.data.email}</p>
            <p className="text-center bg-orange-400 text-white rounded mb-2">
              활동언어 TOP3
            </p>
            <div className="flex flex-row align-center justify-center">
              {profile?.data.mainLanguage.map((item) => {
                return (
                  <Badge enableShadow disableOutline color="secondary">
                    {item}
                  </Badge>
                );
              })}
            </div>
            <div className="mt-5 flex flex-row justify-center items-start">
              <div className="px-3 text-center">
                <p className="text-gray-500">추천</p>
                <b className="text-2xl text-yellow-300">
                  {profile.data.recommendations.length}
                </b>
              </div>
              <div className="px-3 text-center">
                <p className="text-gray-500">게시글</p>
                <b className="text-2xl text-orange-400">
                  {profile.data.boards.length}
                </b>
              </div>
              <div className="px-3 text-center">
                <p className="text-gray-500">답변</p>
                <b className="text-2xl text-orange-400">
                  {profile.data.comments.length}
                </b>
              </div>
            </div>
            {profile?.data.id == member?.data.id ? (
              <button
                onClick={() => navigate("/messagebox")}
                class="bg-yellow-400 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded items-center flex">
                <BiCommentDetail />
                메일박스
              </button>
            ) : (
              <button
                onClick={() => setMessageToggle(!messageToggle)}
                class="bg-yellow-400 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded items-center flex">
                <BiCommentDetail />
                도움요청
              </button>
            )}
          </div>
        </div>
      ) : (
        <h1>로그인 해주세요</h1>
      )}
      {messageToggle && <SendMessage memberId={id} />}
    </div>
  );
};

export default Profile;
