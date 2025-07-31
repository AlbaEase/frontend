// 템플릿 생성하기 눌렀을때 이루어지는 과정
// TemplateCreateForm.tsx
import { useState, useEffect } from "react";
import { postTemplate } from "../../api/scheduleAdd";
import Button from "../Button";
import styles from "./ScheduleAddModal.module.css";

interface Props {
  onBack: () => void;
}

const TemplateCreateForm = ({ onBack }: Props) => {
  const storeId = 1; // TODO: 실제 값으로 대체

  const [templateName, setTemplateName] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [breakHour, setBreakHour] = useState(1);
  const [breakMinute, setBreakMinute] = useState(0);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdTemplate, setCreatedTemplate] = useState<{ templateName: string; startTime: string; endTime: string } | null>(null);

  const handleSubmit = async () => {
    if (!templateName) {
      alert("템플릿명을 입력해주세요.");
      return;
    }

    const breakTime = `${String(breakHour).padStart(2, "0")}:${String(breakMinute).padStart(2, "0")}`;

    const payload = {
      templateName,
      startTime,
      endTime,
      breakTime,
    };

    try {
      await postTemplate(storeId, payload);
      setIsSubmitted(true);
      setCreatedTemplate({ templateName, startTime, endTime });
    } catch (err) {
      console.error("템플릿 생성 실패", err);
      alert("템플릿 생성 중 오류가 발생했습니다.");
    }
  };
    // ✅ 이거 추가
  useEffect(() => {
    setIsSubmitted(false);
    setCreatedTemplate(null);
  }, []);

  return (
    <div className={styles.formBox}>
      {!isSubmitted ? (
        <>
          <div className={styles.formGroup}>
            <label>템플릿명<span className={styles.required}>*</span></label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="ex) 오픈, 4시간, …"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>근무시간<span className={styles.required}>*</span></label>
            <div className={styles.inlineGroup}>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={styles.inputSmall} />
              <span>~</span>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={styles.inputSmall} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>휴게시간<span className={styles.required}>*</span></label>
            <div className={styles.inlineGroup}>
              <input type="number" value={breakHour} onChange={(e) => setBreakHour(Number(e.target.value))} className={styles.inputTiny} />
              <span>시간</span>
              <input type="number" value={breakMinute} onChange={(e) => setBreakMinute(Number(e.target.value))} className={styles.inputTiny} />
              <span>분</span>
            </div>
          </div>

          <div className={styles.formButtonBox}>
            <Button onClick={onBack}>이전</Button>
            <Button onClick={handleSubmit}>생성하기</Button>
          </div>
        </>
      ) : (
        <div className={styles.templateCompleteBox}>
          <p className={styles.completeText}>템플릿 생성이 완료되었습니다!</p>
          {createdTemplate && (
            <div className={styles.templateCard}>
              <div className={styles.role}>{createdTemplate.templateName}</div>
              <div className={styles.time}>
                {createdTemplate.startTime} ~ {createdTemplate.endTime}
              </div>
            </div>
          )}
          <div className={styles.formButtonBox}>
            <Button onClick={onBack}>닫기</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateCreateForm;
