// components/Modal/TemplateSelector.tsx
import { useEffect, useState } from "react";
import { getTemplatesByStoreId, ScheduleTemplate } from "../../api/scheduleAdd";
import { formatTimeFlexible } from "../../utils/timeFormat";
import Button from "../Button";
import styles from "./ScheduleAddModal.module.css";

interface Props {
  onNext: (view: "manual" | "template") => void;
}

const TemplateSelector = ({ onNext }: Props) => {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const storeId = 1; // TODO: 실제 storeId로 대체

  useEffect(() => {
    getTemplatesByStoreId(storeId)
      .then((data) => {
        console.log("✅ 템플릿 불러오기 성공:", data);
        if (data.length > 0) {
          console.log("⏰ startTime 타입 확인:", typeof data[0].startTime, data[0].startTime);
        }
        setTemplates(data);
      })
      .catch((err) => {
        console.error("❌ 템플릿 불러오기 실패:", err);
      });
  }, []);

  return (
    <>
      <div className={styles.templateGrid}>
        {templates.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            템플릿이 없습니다
          </div>
        ) : (
          templates.map((template) => (
            <div key={template.templateId} className={styles.templateCardGrid}>
              <div className={styles.roleText}>{template.templateName}</div>
              <div className={styles.timeText}>
                {formatTimeFlexible(template.startTime)} ~ {formatTimeFlexible(template.endTime)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.buttonBox}>
        <Button onClick={() => onNext("manual")}>직접 등록하기</Button>
        <Button onClick={() => onNext("template")} variant="gray">템플릿 생성하기</Button>
      </div>
    </>
  );
};

export default TemplateSelector;
