// ✅ EditableField: 사용자 정보(이름, 이메일, 비밀번호 등)를 화면에 출력하고,
// 편집 모드일 때, 수정 가능한 항목만 클릭 가능하게 만드는 재사용 컴포넌트
import styles from "./EditableField.module.css";

interface EditableFieldProps {
  label: string;                           // 항목 라벨 (예: 이름)
  value: string;                           // 항목 값 (예: 홍길동)
  fieldName: string;                       // 필드 이름 (예: "fullName", "email")
  isEditing: boolean;                      // 현재 편집 모드인지 여부
  isEditable: boolean;                     // 해당 항목이 수정 가능한지 여부
  onClick?: (field: string) => void;       // 클릭 이벤트 핸들러 (옵션)
}

const EditableField = ({
  label,
  value,
  fieldName,
  isEditing,
  isEditable,
  onClick,
}: EditableFieldProps) => {
  const isClickable = isEditing && isEditable;

  return (
    <div className={styles.contents}>
      <div className={styles.contentsTitle}>{label}</div>
      <div
        className={isClickable ? styles.contentsContentsTrue : styles.contentsContents}
        onClick={isClickable && onClick ? () => onClick(fieldName) : undefined}
      >
        {value || `${label} 없음`}
      </div>
    </div>
  );
};

export default EditableField;
