import axios from "axios";
import { toast } from "react-toastify";

const token = localStorage.getItem("token");
axios.defaults.headers.common["Auth"] = token;

export const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 1000,
});
export const getToken = () => {
  if (token) {
    api
      .get("/api/refresh")
      .then((res) => {
        localStorage.setItem("token", res.data);
      })
      .catch((error) => {
        localStorage.clear();
      });
  }
};

export const sendMessage = (title, content, value, boardId) => {
  let formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("memberId", value);
  formData.append("boardId", boardId);
  api.post("/messages", formData).then(
    toast("메세지를 전송했습니다", {
      position: "top-right",
      autoClose: 3000,
      closeOnClick: true,
      theme: "light",
    })
  );
};
