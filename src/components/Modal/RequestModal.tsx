import styles from "./RequestModal.module.css";
import { useState, useEffect } from "react";
import { useModal } from "../../contexts/ModalContext";
import { useOwnerSchedule } from "../../contexts/OwnerScheduleContext";
import CustomSelect from "../CustomSelect";
import CustomSelectWorker from "../CustomSelectWorker";

interface CalendarScheduleProps {
    onClose: () => void;
}

const RequestModal: React.FC<CalendarScheduleProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    // const [selectedName, setSelectedName] = useState(""); // 교환을 요청할 근무자 (기존 근무자)
    const [selectedOption, setSelectedOption] = useState<
        "all" | "select" | null // 요청 대상 선택 체크박스
    >(null);
    const [selectedWorker, setSelectedWorker] = useState<string[]>([]);

    const { currentDate, selectedName, setSelectedName, otherGroupMembers } =
        useOwnerSchedule();
    const { modalData } = useModal();

    const handleNameChange = (name: string) => {
        setSelectedName(name);
    };

    // useEffect(() => {
    //     console.log("요청 대상 변경됨: ", selectedWorker);
    // }, [selectedWorker]);

    const handleCheckboxChange = (option: "all" | "select") => {
        setSelectedOption(option); // 둘 중 하나만 선택하도록
        if (option === "all") {
            /* 여기 수정해야 됨!!!!!!!!!!!!!!!!!! */
            const allWorkers = otherGroupMembers;
            setSelectedWorker(allWorkers);
        } else {
            setSelectedWorker([]);
        }
    };

    // 각 스텝에 따른 콘텐츠
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                /* 공통 (시작) */
                return (
                    <div className={styles.content}>
                        <div className={styles.category}>
                            <div className={styles.text}>요청 근무일자</div>
                            <div className={styles.schedule}>
                                {currentDate.format("YYYY/MM/DD")} |{" "}
                                {modalData.length > 0 && (
                                    <span className={styles.scheduleList}>
                                        {modalData.map((group, index) => {
                                            // "HH:mm:ss"에서 시와 분만 추출
                                            const startTimeFormatted =
                                                group.startTime
                                                    .split(":")
                                                    .slice(0, 2)
                                                    .join(":");
                                            const endTimeFormatted =
                                                group.endTime
                                                    .split(":")
                                                    .slice(0, 2)
                                                    .join(":");

                                            return (
                                                <span
                                                    key={index}
                                                    className={
                                                        styles.scheduleItem
                                                    }>
                                                    <span
                                                        className={styles.time}>
                                                        {startTimeFormatted} -{" "}
                                                        {endTimeFormatted}
                                                    </span>
                                                </span>
                                            );
                                        })}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={styles.category}>
                            <div className={styles.text}>기존 근무자</div>
                            <div className={styles.employeeName}>
                                <CustomSelect
                                    names={modalData[0].names}
                                    onSelect={handleNameChange}
                                />
                            </div>
                        </div>
                        <div className={styles.category}>
                            <div className={styles.text1}>요청 대상</div>
                            <div className={styles.selectBox}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedOption === "all"}
                                        onChange={() =>
                                            handleCheckboxChange("all")
                                        }
                                    />
                                    근무자 전체
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedOption === "select"}
                                        onChange={() =>
                                            handleCheckboxChange("select")
                                        }
                                    />
                                    근무자 선택하기
                                </label>
                            </div>
                        </div>

                        {/* "근무자 선택하기" 체크박스를 선택했을 때 CustomSelectWorker 렌더링 */}
                        {selectedOption === "select" && (
                            <div className={styles.selelctWorker}>
                                <CustomSelectWorker
                                    names={otherGroupMembers} // 모든 근무자 이름을 flat한 배열로 변환
                                    selectedWorkers={selectedWorker}
                                    onSelect={setSelectedWorker}
                                />
                            </div>
                        )}

                        <div className={styles.confirm} onClick={goToNextStep}>
                            확인
                        </div>
                    </div>
                );
            case 2:
                /* 전체 요청 */
                return (
                    <div className={styles.content2}>
                        <div className={styles.askText}>
                            해당 근무 대체근무를 요청하시겠습니까?
                        </div>
                        <div className={styles.step2text}>
                            <div className={styles.text2}>
                                {"요청일자 : "}
                                <span className={styles.schedule}>
                                    {currentDate.format("YYYY/MM/DD")} |{" "}
                                </span>
                                {modalData.length > 0 && (
                                    <span className={styles.scheduleList}>
                                        {modalData.map(
                                            (group: any, index: any) => {
                                                // "HH:mm:ss"에서 시와 분만 추출
                                                const startTimeFormatted =
                                                    group.startTime
                                                        .split(":")
                                                        .slice(0, 2)
                                                        .join(":");
                                                const endTimeFormatted =
                                                    group.endTime
                                                        .split(":")
                                                        .slice(0, 2)
                                                        .join(":");

                                                return (
                                                    <span
                                                        key={index}
                                                        className={
                                                            styles.scheduleItem
                                                        }>
                                                        <span
                                                            className={
                                                                styles.time
                                                            }>
                                                            {startTimeFormatted}{" "}
                                                            ~ {endTimeFormatted}
                                                        </span>
                                                    </span>
                                                );
                                            }
                                        )}
                                    </span>
                                )}
                            </div>
                            <div className={styles.text2}>
                                {"기존 근무자 : "}
                                <span className={styles.selectedName}>
                                    {selectedName || "선택된 근무자 없음"}
                                </span>
                            </div>
                            <div className={styles.text2}>
                                {"요청 대상 : "}
                                <span>
                                    {selectedWorker.length > 0
                                        ? selectedWorker.join(", ")
                                        : "없음"}
                                </span>
                            </div>
                        </div>
                        <div className={styles.confirm2} onClick={goToNextStep}>
                            확인
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className={styles.content}>
                        <div className={styles.text3}>
                            근무 요청이 완료되었습니다.
                        </div>
                        <div className={styles.confirm3} onClick={onClose}>
                            확인
                        </div>
                    </div>
                );
            default:
                return <div className={styles.content}>Loading...</div>;
        }
    };

    // 다음 스텝으로 이동
    const goToNextStep = () => {
        if (selectedWorker.length === 0) {
            alert("요청 대상을 1명 이상 선택해주세요.");
            return;
        }
        setCurrentStep((prevStep) => prevStep + 1);
    };

    return (
        <div className={styles.modalOverlay}>
            {/* 모달창 사이즈 동적으로 조정 / modal, smallModal */}
            <div
                className={`${styles.modal} ${
                    currentStep !== 1 ? styles.secondModal : ""
                }`}>
                <div className={styles.container} style={{ marginTop: "20px" }}>
                    <div className={styles.title}>
                        {currentStep !== 3 ? "근무 요청하기" : "요청 완료"}
                    </div>
                    <div
                        className={`${styles.button} ${
                            currentStep === 3 ? styles.invisible : ""
                        }`}
                        onClick={onClose}>
                        취소
                    </div>
                </div>
                <div className={styles.contentContainer}>
                    {renderStepContent()}
                </div>
            </div>
        </div>
    );
};

export default RequestModal;
