import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../Api";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@nextui-org/react";
import { BiCommentDetail } from "react-icons/bi";
import Select from "react-select";
import { BsStarFill } from "react-icons/bs";
import Button from "@mui/material/Button";
import Pagination from "../components/Pagination";

const List = () => {
  let { id } = useParams();
  let limitNumber = 10;
  if (window.localStorage.getItem("limitNumber")) {
    limitNumber = window.localStorage.getItem("limitNumber");
  }
  let pageNumber = 1;
  if (window.localStorage.getItem("pageNumber")) {
    pageNumber = window.localStorage.getItem("pageNumber");
  }

  const [limit, setLimit] = useState(limitNumber);
  const [page, setPage] = useState(pageNumber);
  const offset = (page - 1) * limit;

  const { data: member } = useQuery("member", () => {
    return api.get("/member");
  });
  const { data: categoryName } = useQuery("categoryName", () => {
    return api.get(`/category/${id}`);
  });
  const { data: list } = useQuery("list", () => {
    return api.get(`/board/${id}`);
  });
  const { data: tagAll } = useQuery("tagAll", () => {
    return api.get(`/tag/all`);
  });
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  let arr = [];
  selected.map((i) => {
    arr.push(i.value);
  });
  let filteredList = [];
  if (selected.length > 0) {
    arr.map((filterValue) => {
      filteredList.push(
        ...list?.data.filter((val) => val.text.includes(filterValue))
      );
    });
  } else if (selected.length == 0) {
    list?.data.map((i) => {
      filteredList.push(i);
    });
  }
  filteredList.map((i) => {
    const sum = i.comments.reduce(
      (acc, o) => acc + parseInt(o.recommendations.length),
      0
    );
  });

  return (
    <div>
      <div className="mb-10">
        <span className="text-4xl text-white m-5 p-2  bg-orange-400 border-orange800	 rounded-2xl	cardShadow">
          {categoryName?.data}
        </span>
      </div>

      <div className="flex m-8">
        <label>
          표시 게시물 수:&nbsp;
          <select
            type="number"
            className="p-2
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding bg-no-repeat
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          "
            value={limit}
            onChange={({ target: { value } }) => {
              return (
                setLimit(Number(value)),
                window.localStorage.setItem("limitNumber", Number(value)),
                window.localStorage.setItem("pageNumber", 1),
                setPage(1)
              );
            }}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </label>
        <Select
          isMulti
          placeholder="검색하실 태그를 선택해주세요"
          className="m-auto w-[300px]"
          options={tagAll?.data}
          onChange={(opt) => {
            return (
              setSelected(opt),
              window.localStorage.setItem("pageNumber", 1),
              setPage(1)
            );
          }}
        />
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          className="m-auto w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="상세검색..."
          required></input>
      </div>
      <div className="m-8"></div>

      {member ? (
        <div className="text-center m-10">
          <Link to={`/board/post/${id}`}>
            <Button
              color="warning"
              variant="contained"
              startIcon={<BiCommentDetail />}>
              질문하기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="text-center m-10">
          <Button
            color="warning"
            variant="contained"
            startIcon={<BiCommentDetail />}>
            로그인 후 질문
          </Button>
        </div>
      )}
      {filteredList
        .slice(offset, offset + limit)
        .filter((secondFilter) => {
          return secondFilter.title.toLowerCase().includes(search);
        })
        .map((i) => {
          return (
            <div className="pl-12 pr-12 p-1">
              <Link to={`/board/get/${i.id}`}>
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "rgba(218, 223, 225, 0.9)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    backgroundColor: ["rgba(236, 240, 241, 0.9)", "#fff"],
                  }}>
                  <div
                    className="flex rounded border border-gray-300 shadow hover:border hover:border-gray-600 w-full"
                    key={i.id}>
                    <div className="space-x-6 p-2">
                      <Badge
                        content={`${i.comments.reduce(
                          (acc, o) => acc + parseInt(o.recommendations.length),
                          0
                        )}`}
                        color="error"
                        placement="top-right"
                        size="xs"
                        className="z-0">
                        <BsStarFill
                          className="border-dashed border-4 rounded border-lime-500"
                          color="gold"
                          size={40}
                        />
                      </Badge>
                      <Badge
                        content={`${i.comments.length}`}
                        color="error"
                        placement="top-right"
                        size="xs"
                        className="z-0">
                        <BiCommentDetail
                          className="border-dashed border-4 rounded border-lime-500"
                          color="gold"
                          size={40}
                        />
                      </Badge>
                    </div>
                    <div className="py-4">
                      <div className="text-xl">{i.title}</div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          );
        })}
      <Pagination
        total={
          filteredList.filter((secondFilter) => {
            return secondFilter.title.toLowerCase().includes(search);
          }).length
        }
        limit={limit}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default List;
