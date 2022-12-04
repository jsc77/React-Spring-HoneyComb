import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { api } from "../Api";
import honeycomb from "../img/honeycomb.png";
import honeyfont from "../img/honeycombfont.png";
const Home = () => {
  const { data: member } = useQuery("member", () => {
    return api.get("/member");
  });
  return (
    <div className="container">
      <div className="flex justify-between">
        <div className="w-full text-center">
          <h2 className="text-4xl font-bold leading-snug text-gray-700 mb-10 wow fadeInUp">
            개발자들의 벌집
          </h2>
          <h4 className="text-2xl font-bold leading-snug text-gray-700 mb-10 wow fadeInUp">
            꿀 떨어지는 정보창고
          </h4>
          <div className="text-center mb-10">
            {" "}
            {member?.data ? (
              <span className=" text-orange-400 rounded-lg text-xl px-5 py-2.5 text-center mr-0">
                {member?.data.name}님 환영합니다
              </span>
            ) : (
              <Link
                to="/signin"
                type="button"
                className="cursor-pointer text-white bg-yellow-400 hover:bg-orange-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-0">
                <div>지금 시작하기</div>
              </Link>
            )}
          </div>
          <img className="m-auto w-[200px] h-[200px] " src={honeycomb} />
          <img className="m-auto" src={honeyfont} />
        </div>
      </div>
    </div>
  );
};

export default Home;
