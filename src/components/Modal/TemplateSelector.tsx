// 근무 템플릿을 선택하거나 새로 등록하여 다음 단계로 넘어가는 선택 화면
// 여기서 3개의 폼으로 넘어간다고 생각
// 직접, 폼생성, 폼근무등록
import { useEffect, useState } from "react";
import { getTemplatesByStoreId, ScheduleTemplate } from "../../api/scheduleAdd";
import { formatTimeFlexible } from "../../utils/timeFormat";
import Button from "../Button";
import styles from "./ScheduleAddModal.module.css";

interface Props {
  onNext: (
    view:
      | { type: "manual" }
      | { type: "template" }
      | { type: "templateForm"; templateId: number }
  ) => void;
}

const TemplateSelector = ({ onNext }: Props) => {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const storeId = 1;

  useEffect(() => {
    getTemplatesByStoreId(storeId)
      .then((data) => {
        console.log("\u2705 \ud15c\ud50c\ub9bf \ubd88\ub7ec\uc624\uae30 \uc131\uacf5:", data);
        if (data.length > 0) {
          console.log("\u23f0 startTime \ud0c0\uc785 \ud655\uc778:", typeof data[0].startTime, data[0].startTime);
        }
        setTemplates(data);
      })
      .catch((err) => {
        console.error("\u274c \ud15c\ud50c\ub9bf \ubd88\ub7ec\uc624\uae30 \uc2e4\ud328:", err);
      });
  }, []);

  const handleConfirm = () => {
    if (selectedTemplateId !== null) {
      onNext({ type: "templateForm", templateId: selectedTemplateId });
    } else {
      alert("\ud15c\ud50c\ub9bf\uc744 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.");
    }
  };

  return (
    <>
      <div className={styles.templateGrid}>
        {templates.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            \ud15c\ud50c\ub9bf\uc774 \uc5c6\uc2b5\ub2c8\ub2e4
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.templateId}
              className={`${styles.templateCardGrid} ${
                selectedTemplateId === template.templateId ? styles.selectedCard : ""
              }`}
              onClick={() => setSelectedTemplateId(template.templateId)}
            >
              <div className={styles.roleText}>{template.templateName}</div>
              <div className={styles.timeText}>
                {formatTimeFlexible(template.startTime)} ~ {formatTimeFlexible(template.endTime)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.buttonBox}>
        <Button onClick={() => onNext({ type: "manual" })}>근무 직접 등록하기</Button>
        <Button onClick={() => onNext({ type: "template" })} variant="gray">
          템플릿 등록하기
        </Button>
        <Button onClick={handleConfirm} variant="green">확인</Button>
      </div>
    </>
  );
};

export default TemplateSelector;
