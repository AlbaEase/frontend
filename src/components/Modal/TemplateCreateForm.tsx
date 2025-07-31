// 템플릿 생성하기 눌렀을때 이루어지는 과정
// TemplateCreateForm.tsx
import React from "react";
import Button from "../Button";

interface Props {
  onBack: () => void;
}

const TemplateCreateForm: React.FC<Props> = ({ onBack }) => {
  return (
    <div>
      <div>템플릿 생성 폼 자리</div>
      <Button onClick={onBack}>이전</Button>
    </div>
  );
};

export default TemplateCreateForm;
