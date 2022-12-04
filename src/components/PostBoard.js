import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import EditorComponent from "./EditorComponent";
import { api } from "../Api";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@nextui-org/react";
import Tag from "./Tag";

export default function PostBoard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState();
  const [text, setText] = useState();
  const [tags, setTags] = useState();
  const steps = ["제목을 입력하세요", "내용을 입력하세요"];
  const description = [
    <Input
      onChange={(e) => setTitle(e.target.value)}
      value={title}
      minRows={1}
      fullWidth
      bordered
      borderWeight="light"
      status="warning"
      placeholder="제목을 입력해주세요"
    />,
    <EditorComponent text={text} setText={setText} />,
  ];
  const createBoard = async () => {
    let formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    tags.forEach((tag) => {
      formData.append("tags[]", tag);
    });

    await api.post(`/board/${id}`, formData).then((res) => {
      navigate(`/board/get/${res.data}`);
    });
  };

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const totalSteps = steps.length;
  const completedSteps = Object.keys(completed).length;
  const allStepsCompleted = completedSteps === totalSteps;

  const handleNext = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <div>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={step} completed={completed[index]}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted ? (
          <div className="text-center m-10">
            <Typography>해시태그를 입력해주세요</Typography>
            <Tag setTags={setTags} />
            <div className="mt-10">
              <Button onClick={handleReset} variant={"contained"}>
                다시작성
              </Button>
              <Button variant="outlined" onClick={createBoard}>
                제출
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Typography>
              <div className="m-10">{description[activeStep]}</div>
            </Typography>
            <Button
              onClick={handleBack}
              variant={"contained"}
              disabled={activeStep === 0}>
              뒤로
            </Button>
            <Button color="warning" onClick={handleNext} variant={"contained"}>
              {completedSteps !== totalSteps && "다음"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
