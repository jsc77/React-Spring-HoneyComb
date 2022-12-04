import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { api } from "../Api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GiPartyPopper } from "react-icons/gi";
import google from "../img/google_icon.png";
import kakao from "../img/kakao_icon.png";
import naver from "../img/naver_icon.png";

const Signin = () => {
  const navigate = useNavigate();
  const tokenExist = localStorage.getItem("token");
  const token = new URL(window.location.href).searchParams.get("Auth");
  if (token) {
    localStorage.setItem("token", token);
  }
  window.history.replaceState({}, null, window.location.pathname);
  const { data: member } = useQuery("member", () => {
    return api.get("/member");
  });
  useEffect(() => {
    if (member?.data.name != undefined) {
      toast(member.data.name + "님 환영합니다", {
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true,
        theme: "light",
      });
      toast("30분동안 동작이 없을 시 자동으로 로그아웃됩니다", {
        position: "top-right",
        autoClose: 2000,
        closeOnClick: true,
        theme: "light",
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, [member?.data.name]);

  useEffect(() => {
    if (token) {
      if (localStorage.getItem("reloaded")) {
        localStorage.removeItem("reloaded");
      } else {
        localStorage.setItem("reloaded", "1");
        window.location.reload();
      }
    }
  }, []);

  return (
    <div className="grid place-items-center h-52">
      {tokenExist ? (
        <h1 class="flex text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          <GiPartyPopper
            className="bg-yellow-400 rounded-xl text-white "
            size={70}
          />
          환영합니다
        </h1>
      ) : (
        <>
          <a href="http://localhost:8080/oauth2/authorization/google">
            <button class="bg-white border py-2 w-36 rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]">
              <img className="h-12 w-12" src={google} />
            </button>
          </a>
          <a href="http://localhost:8080/oauth2/authorization/kakao">
            <button class="bg-white border py-2 w-36 rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]">
              <img className="h-12 w-12" src={kakao} />
            </button>
          </a>
          <a href="http://localhost:8080/oauth2/authorization/naver">
            <button class="bg-white border py-2 w-36 rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]">
              <img className="h-12 w-12" src={naver} />
            </button>
          </a>
        </>
      )}
    </div>
  );
};
export default Signin;
