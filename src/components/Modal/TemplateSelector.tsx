import { useEffect, useState } from "react";
import { getTemplatesByStoreId, ScheduleTemplate } from "../../api/scheduleAdd";
import { formatTime } from "../../utils/timeFormat"; // 시간 09:00 포맷 함수
import Button from "../Button";
import styles from "./ScheduleAddModal.module.css";

interface Props {
  onNext: (view: "manual" | "template") => void;
}

const TemplateSelector = ({ onNext }: Props) => {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const storeId = 1; // TODO: 실제 storeId는 props/context에서 받아오기

  useEffect(() => {
    getTemplatesByStoreId(storeId)
      .then((data) => {
        console.log("✅ 템플릿 불러오기 성공:", data);
        setTemplates(data);
      })
      .catch((err) => {
        console.error("❌ 템플릿 불러오기 실패:", err);
      });
  }, []);

  return (
    <>
      <div className={styles.templeteBox}>
        {templates.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "40px" }}>템플릿이 없습니다</div>
        ) : (
          templates.map((template) => (
            <div key={template.templateId} className={styles.templateCard}>
              <div className={styles.role}>{template.templateName}</div>
              <div className={styles.time}>
                {formatTime(template.startTime)} ~ {formatTime(template.endTime)}
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
