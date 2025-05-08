import styles from "./RequestModal.module.css";
import { useState } from "react";
import { useModal } from "../../contexts/ModalContext";
import { useOwnerSchedule } from "../../contexts/OwnerScheduleContext";
import CustomSelect from "../CustomSelect";
import CustomSelectWorker from "../CustomSelectWorker";
import { requestShift, requestModification } from "../../api/apiService";

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
    const [requestDetails, setRequestDetails] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const { currentDate, selectedName, setSelectedName, otherGroupMembers } =
        useOwnerSchedule();
    const { modalData } = useModal();

    const handleNameChange = (name: string) => {
        setSelectedName(name);
    };

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

    const handleRequestDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRequestDetails(e.target.value);
    };

    // 백엔드로 대타 요청 또는 근무 수정 요청 전송
    const sendRequest = async () => {
        if (!modalData || modalData.length === 0) {
            setError("스케줄 정보를 찾을 수 없습니다.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 현재 매장 ID와 선택된 스케줄 ID 가져오기
            const storeId = modalData[0].storeId || 1; // 기본값 1
            const scheduleId = modalData[0].scheduleId;

            if (selectedOption === "select" && selectedWorker.length > 0) {
                // 특정 근무자 대상 대타 요청
                await requestShift(storeId, {
                    toUserId: parseInt(selectedWorker[0]), // 첫 번째 선택된 근무자 ID
                    scheduleId: scheduleId,
                    requestType: "SPECIFIC_USER",
                    requestDate: currentDate.format("YYYY-MM-DD")
                });
            } else if (selectedOption === "all") {
                // 전체 근무자 대상 대타 요청
                await requestShift(storeId, {
                    toUserId: 0, // 0은 전체 대상을 의미
                    scheduleId: scheduleId,
                    requestType: "ALL_USERS",
                    requestDate: currentDate.format("YYYY-MM-DD")
                });
            } else if (requestDetails) {
                // 근무 수정 요청 (단계 3에서 요청 내용이 있는 경우)
                await requestModification(storeId, {
                    scheduleId: scheduleId,
                    details: requestDetails
                });
            } else {
                setError("요청 대상을 선택하거나 근무 수정 내용을 입력해주세요.");
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                onClose(); // 요청 성공 후 모달 닫기
            }, 2000);
        } catch (err) {
            console.error("요청 전송 중 오류 발생:", err);
            setError("요청을 처리하는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
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
                                        {modalData.map((group: any, index: any) => {
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
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedOption === null && currentStep === 1}
                                        onChange={() => {
                                            setSelectedOption(null);
                                            setCurrentStep(3); // 근무 수정 요청 단계로 이동
                                        }}
                                    />
                                    근무 수정 요청하기
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
                                    {selectedOption === "all" 
                                        ? "모든 근무자" 
                                        : (selectedWorker.length > 0
                                            ? selectedWorker.join(", ")
                                            : "없음")}
                                </span>
                            </div>
                        </div>
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        {success ? (
                            <div className={styles.successMessage}>
                                요청이 성공적으로 전송되었습니다.
                            </div>
                        ) : (
                            <div 
                                className={`${styles.confirm2} ${loading ? styles.loading : ''}`} 
                                onClick={loading ? undefined : sendRequest}
                            >
                                {loading ? "요청 중..." : "확인"}
                            </div>
                        )}
                    </div>
                );
            case 3:
                /* 근무 수정 요청 */
                return (
                    <div className={styles.content2}>
                        <div className={styles.askText}>
                            근무 수정 내용을 입력해주세요
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
                            <div className={styles.textareaContainer}>
                                <textarea
                                    className={styles.modificationDetails}
                                    placeholder="근무 수정을 원하는 내용을 입력해주세요. (예: 9시~18시에서 10시~19시로 변경 희망)"
                                    value={requestDetails}
                                    onChange={handleRequestDetailsChange}
                                    rows={5}
                                />
                            </div>
                        </div>
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        {success ? (
                            <div className={styles.successMessage}>
                                요청이 성공적으로 전송되었습니다.
                            </div>
                        ) : (
                            <div 
                                className={`${styles.confirm2} ${loading ? styles.loading : ''}`} 
                                onClick={loading ? undefined : sendRequest}
                            >
                                {loading ? "요청 중..." : "확인"}
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const goToNextStep = () => {
        if (currentStep === 1) {
            if (selectedOption === null) {
                setCurrentStep(3); // 근무 수정 요청 단계로 이동
            } else {
                setCurrentStep(2); // 대타 요청 단계로 이동
            }
        } else if (currentStep === 2) {
            sendRequest(); // 대타 요청 전송
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div
                    className={styles.container}
                    style={{ marginTop: "20px" }}>
                    <div className={styles.title}>
                        {currentStep === 3 ? "근무 수정 요청" : "대체근무 요청"}
                    </div>
                    <div className={styles.button} onClick={onClose}>
                        취소
                    </div>
                </div>
                {renderStepContent()}
            </div>
        </div>
    );
};

export default RequestModal;
