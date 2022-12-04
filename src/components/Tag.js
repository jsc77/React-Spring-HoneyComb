import React, { useState } from "react";

const Tag = (props) => {
  const [tagItem, setTagItem] = useState("");
  const [tagList, setTagList] = useState([]);

  const onKeyPress = (e) => {
    if (e.target.value.length !== 0 && e.key === "Enter") {
      submitTagItem();
    }
  };

  const submitTagItem = () => {
    let updatedTagList = [...tagList];
    updatedTagList.push(tagItem);
    setTagList(updatedTagList);
    props.setTags(updatedTagList);
    setTagItem("");
  };
  const deleteTagItem = (e) => {
    const deleteTagItem = e.target.parentElement.firstChild.innerText;
    const filteredTagList = tagList.filter(
      (tagItem) => tagItem !== deleteTagItem
    );
    setTagList(filteredTagList);
    props.setTags(filteredTagList);
  };
  return (
    <div className="p-10">
      <div className="flex h-[50px] items-center flex-wrap m-2 border border-orange-400 rounded">
        {tagList.map((tagItem, index) => {
          return (
            <div
              key={index}
              className="flex items-center justify-between m-1 p-1 rounded bg-orange-400 text-white text-xs">
              <span>{tagItem}</span>
              <button
                className="flex justify-center items-center w-4 h-4 ml-1"
                onClick={deleteTagItem}>
                X
              </button>
            </div>
          );
        })}
        <input
          className="inline-flex w-28 h-12 bg-transparent cursor-text"
          type="text"
          placeholder="예) useState"
          tabIndex={2}
          onChange={(e) => setTagItem(e.target.value)}
          value={tagItem}
          onKeyPress={onKeyPress}
        />
      </div>
    </div>
  );
};

export default Tag;
