// 직접 등록하기 버튼을 눌렀을때 이루어지는 과정 컴포넌트 분리해서 진행
// TemplateCreateForm.tsx
// ManualScheduleForm.tsx
import { useEffect, useState } from "react";
import { getWorkersByStoreId, Worker } from "../../api/albaAdd";
import { postManualSchedule } from "../../api/scheduleAdd";
import { useModal } from "../../contexts/ModalContext";
import Button from "../Button";
import styles from "./ScheduleAddModal.module.css";

interface Props {
  onBack: () => void;
}

const ManualScheduleForm = ({ onBack }: Props) => {
  const { closeModal } = useModal();

  const storeId = 1;
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [userId, setUserId] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [breakHour, setBreakHour] = useState(1);
  const [breakMinute, setBreakMinute] = useState(0);

  useEffect(() => {
    getWorkersByStoreId(storeId)
      .then((res) => setWorkers(res.data))
      .catch((err) => console.error("알바생 불러오기 실패", err));
  }, []);

  const handleSubmit = async () => {
    if (!date || userId === "") {
      alert("날짜와 알바생을 모두 선택해 주세요");
      return;
    }

    const breakTime = `${String(breakHour).padStart(2, "0")}:${String(breakMinute).padStart(2, "0")}`;

    const payload = {
      userIds: [Number(userId)],
      storeId,
      workDate: date,
      startTime,
      endTime,
      breakTime,
    };

    try {
      await postManualSchedule(storeId, payload);
      alert("근무 등록 완료!");
      closeModal();
    } catch (err) {
      console.error("근무 등록 실패", err);
      alert("근무 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.formBox}>
      <div className={styles.formGroup}>
        <label>근무 날짜<span className={styles.required}>*</span></label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={styles.input} />
      </div>

      <div className={styles.formGroup}>
        <label>적용할 알바생<span className={styles.required}>*</span></label>
        <select value={userId} onChange={(e) => setUserId(Number(e.target.value))} className={styles.input}>
          <option value="">선택하기</option>
          {workers.map((w) => (
            <option key={w.userId} value={w.userId}>{w.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>근무시간</label>
        <div className={styles.inlineGroup}>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={styles.inputSmall} />
          <span>~</span>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={styles.inputSmall} />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>휴게시간</label>
        <div className={styles.inlineGroup}>
          <input type="number" value={breakHour} onChange={(e) => setBreakHour(Number(e.target.value))} min={0} max={12} className={styles.inputTiny} />
          <span>시간</span>
          <input type="number" value={breakMinute} onChange={(e) => setBreakMinute(Number(e.target.value))} min={0} max={59} className={styles.inputTiny} />
          <span>분</span>
        </div>
      </div>

      <div className={styles.formButtonBox}>
        <Button onClick={onBack}>이전</Button>
        <Button onClick={handleSubmit}>확인</Button>
      </div>
    </div>
  );
};

export default ManualScheduleForm;
