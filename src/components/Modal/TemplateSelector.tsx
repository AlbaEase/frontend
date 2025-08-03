// 근무 템플릿을 선택하거나 새로 등록하여 다음 단계로 넘어가는 선택 화면
// 여기서 3개의 폼으로 넘어감: 직접 등록, 템플릿 생성, 템플릿으로 근무 등록
import { useEffect, useState } from "react";
import { getTemplatesByStoreId, ScheduleTemplate } from "../../api/scheduleAdd";
import { formatTimeFlexible } from "../../utils/timeFormat";
import Button from "../Button";
import styles from "./ScheduleAddModal.module.css";

interface Props {
  onNext: (
    view:
      | { type: "manual" }              // 근무 직접 등록
      | { type: "template" }            // 템플릿 생성
      | { type: "templateForm"; templateId: number } // 템플릿으로 근무 등록
  ) => void;
}

const TemplateSelector = ({ onNext }: Props) => {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const storeId = 1; // TODO: 실제 storeId로 교체

  // 템플릿 리스트 불러오기
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

  // 확인 버튼 클릭 시, 템플릿 ID를 넘김
  const handleConfirm = () => {
    if (selectedTemplateId !== null) {
      onNext({ type: "templateForm", templateId: selectedTemplateId });
    } else {
      alert("템플릿을 선택해주세요.");
    }
  };

  return (
    <>
      {/* 템플릿 목록 영역 */}
      <div className={styles.templateGrid}>
        {templates.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            템플릿이 없습니다.
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
        {/* 템플릿 선택 시에만 확인 버튼 노출 */}
        {selectedTemplateId !== null && (
          <div className={styles.confirmButton}>
            <Button onClick={handleConfirm} variant="blue">
              확인
            </Button>
          </div>
        )}
      </div>



      {/* 하단 버튼 영역 */}
      <div className={styles.buttonBox}>
        <Button onClick={() => onNext({ type: "manual" })}>
          근무 직접 등록하기
        </Button>
        <Button onClick={() => onNext({ type: "template" })} variant="gray">
          템플릿 등록하기
        </Button>
      </div>
    </>
  );
};

export default TemplateSelector;
