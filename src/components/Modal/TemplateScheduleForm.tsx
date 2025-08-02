// 만들어진 템플릿 근무 등록
import { useState, useEffect } from "react";
import { getTemplatesByStoreId, ScheduleTemplate, postScheduleFromTemplate } from "../../api/scheduleAdd";
import { getWorkersByStoreId, Worker } from "../../api/albaAdd";
import { formatTimeFlexible } from "../../utils/timeFormat";
import styles from "./ScheduleAddModal.module.css";
import Button from "../Button";

interface Props {
  templateId: number;
  onBack: () => void;
  onSuccess: () => void;
}

const TemplateScheduleForm = ({ templateId, onBack, onSuccess }: Props) => {
  const [workDate, setWorkDate] = useState("");
  const [repeatEndDate, setRepeatEndDate] = useState("");
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [userIds, setUserIds] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ScheduleTemplate | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const storeId = 1; // TODO: 실제 storeId로 대체

  useEffect(() => {
    getTemplatesByStoreId(storeId).then((data) => {
      const found = data.find((t) => t.templateId === templateId);
      setSelectedTemplate(found ?? null);
    });

    getWorkersByStoreId(storeId).then((res) => {
      setWorkers(res.data);
    });
  }, [templateId]);

  const handleSubmit = async () => {
    try {
      await postScheduleFromTemplate(templateId, {
        userIds,
        storeId,
        workDate,
        repeatDays,
        repeatEndDate,
        repeating: true,
      });
      alert("스케줄이 등록되었습니다.");
      onSuccess();
    } catch (error) {
      console.error("등록 실패", error);
      alert("스케줄 등록에 실패했습니다.");
    }
  };

  return (
    <div className={styles.formBox2}>
      {selectedTemplate && (
        <div className={styles.selectedTemplateBox}>
          <div className={styles.roleText}>{selectedTemplate.templateName}</div>
          <div className={styles.timeText}>
            {formatTimeFlexible(selectedTemplate.startTime)} ~ {formatTimeFlexible(selectedTemplate.endTime)}
          </div>
        </div>
      )}

      <div className={styles.formBox2Element}>
        <div className={styles.formBox2L}>
          <div>
            <label>
              <div>근무 시작일</div>
              <input
                type="date"
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
                className={styles.formBox2input}
              />
            </label>
          </div>

          <div>
            <label>
              <div>반복 종료일</div>
              <input
                type="date"
                value={repeatEndDate}
                onChange={(e) => setRepeatEndDate(e.target.value)}
                className={styles.formBox2input}
              />
            </label>
          </div>

          <div>
            <div>반복 요일:</div>
            {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
              <button
                key={day}
                onClick={() =>
                  setRepeatDays((prev) =>
                    prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                  )
                }
                style={{
                  backgroundColor: repeatDays.includes(day) ? "#aaf" : "#eee",
                  margin: "4px",
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formBox2R}>
          <label>
            <div>알바생 선택</div>
            <select
              onChange={(e) => setUserIds([parseInt(e.target.value, 10)])}
              className={styles.formBox2input}
              defaultValue=""
            >
              <option value="" disabled>
                알바생을 선택하세요
              </option>
              {workers.map((worker) => (
                <option key={worker.userId} value={worker.userId}>
                  {worker.name} (ID: {worker.userId})
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className={styles.formButtonBox}>
        <Button onClick={onBack}>이전</Button>
        <Button onClick={handleSubmit}>등록</Button>
      </div>
    </div>
  );
};

export default TemplateScheduleForm;
