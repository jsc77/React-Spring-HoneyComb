import React, { useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { api } from "../Api";

const EditorComponent = (props) => {
  const QuillRef = useRef();
  const imageHandler = () => {
    const input = document.createElement("input");
    const formData = new FormData();
    let url;
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files;
      if (file !== null) {
        formData.append("file", file[0]);
        const res = await api.post("/boardImage", formData);
        url = res.data;

        // 커서의 위치를 알고 해당 위치에 이미지 태그를 넣어주는 코드
        // 해당 DOM의 데이터가 필요하기에 useRef를 사용한다.
        const range = QuillRef.current?.getEditor().getSelection()?.index;
        if (range !== null && range !== undefined) {
          let quill = QuillRef.current?.getEditor();
          quill?.setSelection(range, 1);
          quill?.clipboard.dangerouslyPasteHTML(
            range,
            `<img width="500" src="http://localhost:8080/boardImage/${url}"/>`
          );
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
          ["image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  return (
    <div className="card-container bg-orange-400">
      <div className="bg-white">
        <ReactQuill
          ref={(element) => {
            if (element !== null) {
              QuillRef.current = element;
            }
          }}
          value={props.text}
          onChange={props.setText}
          modules={modules}
          theme="snow"
          placeholder="내용을 입력해주세요."
        />
      </div>
    </div>
  );
};
export default EditorComponent;
