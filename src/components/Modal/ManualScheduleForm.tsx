// 직접 등록하기 버튼을 눌렀을때 이루어지는 과정 컴포넌트 분리해서 진행
// TemplateCreateForm.tsx
// ManualScheduleForm.tsx
import React from "react";
import Button from "../Button";

interface Props {
  onBack: () => void;
}

const ManualScheduleForm: React.FC<Props> = ({ onBack }) => {
  return (
    <div>
      <div>직접 등록 폼 자리</div>
      <Button onClick={onBack}>이전</Button>
    </div>
  );
};

export default ManualScheduleForm;

