import styles from "./RequestModal.module.css";
import { useState } from "react";
import { useModal } from "../../contexts/ModalContext";
import { useOwnerSchedule } from "../../contexts/OwnerScheduleContext";
import CustomSelect from "../CustomSelect";

interface CalendarScheduleProps {
  onClose: () => void;
}

// type Schedule = {
//     startTime: string;
//     endTime: string;
//     names: string[];
// };

const RequestModal: React.FC<CalendarScheduleProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { currentDate } = useOwnerSchedule();
  const { modalData } = useModal();

  console.log("modalData:", modalData);

  // 각 스텝에 따른 콘텐츠
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.content}>
            <div className={styles.category}>
              <div className={styles.text}>요청 근무일자</div>
              <div className={styles.schedule}>
                {currentDate.format("YYYY/MM/DD")} |
                {modalData.length > 0 && (
                  <span className={styles.scheduleList}>
                    {modalData.map((group, index) => {
                      // "HH:mm:ss"에서 시와 분만 추출
                      const startTimeFormatted = group.startTime
                        .split(":")
                        .slice(0, 2)
                        .join(":");
                      const endTimeFormatted = group.endTime
                        .split(":")
                        .slice(0, 2)
                        .join(":");

                      return (
                        <div key={index} className={styles.scheduleItem}>
                          <div className={styles.time}>
                            {startTimeFormatted} - {endTimeFormatted}
                          </div>
                        </div>
                      );
                    })}
                  </span>
                )}
                {modalData.startTime}{" "}
              </div>
            </div>
            <div className={styles.category}>
              <div className={styles.text}>기존 근무자</div>
              <div className={styles.employeeName}>
                <CustomSelect names={modalData[0].names} />
              </div>
            </div>
            <div className={styles.category}>
              <div className={styles.text}>요청 대상</div>
              <div className={styles.selectBox}>
                <label>
                  <input type="checkbox" />
                  근무자 전체
                </label>
                <label>
                  <input type="checkbox" />
                  근무자 선택하기
                </label>
              </div>
            </div>
            <div className={styles.confirm} onClick={goToNextStep}>
              확인
            </div>
          </div>
        );
      case 2:
        return <div className={styles.content}>스텝 2 내용</div>;
      case 3:
        return <div className={styles.content}>스텝 3 내용</div>;
      default:
        return <div className={styles.content}>Loading...</div>;
    }
  };

  // 다음 스텝으로 이동
  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{ marginTop: "20px" }}>
          <div className={styles.title}>
            {currentStep !== 3 ? "근무 요청하기" : "요청 완료"}
          </div>
          <div className={styles.button} onClick={onClose}>
            취소
          </div>
        </div>
        <div className={styles.contentContainer}>{renderStepContent()}</div>
      </div>
    </div>
  );
};

export default RequestModal;
