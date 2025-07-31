// TemplateSelector.tsx
import React from "react";
import Button from "../Button";

interface Props {
  onNext: (view: "manual" | "template") => void;
}

const TemplateSelector: React.FC<Props> = ({ onNext }) => {
  return (
    <div>
      <div>템플릿 목록 나올 자리</div>
      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        <Button onClick={() => onNext("manual")}>직접 등록하기</Button>
        <Button onClick={() => onNext("template")} variant="gray">템플릿 생성하기</Button>
      </div>
    </div>
  );
};

export default TemplateSelector;
