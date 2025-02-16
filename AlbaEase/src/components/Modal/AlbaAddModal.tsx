import styles from "./AlbaAddModal.module.css";
import { useState } from "react";
import Button from "../Button";

interface AlbaAddModalProps {
  onClose: () => void;
}

const AlbaAddModal: React.FC<AlbaAddModalProps> = ({ onClose }) => {
  const [businessNumber, setBusinessNumber] = useState<string>("");
  const [shop, setShop] = useState<string>("이디야 성공회대학교");
  const handleBusinessNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessNumber(e.target.value);
  };

  const openShop = () => {};

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.container} style={{ marginTop: "20px" }}>
          <div className={styles.title}>근무지 등록하기</div>
          <div className={styles.button} onClick={onClose}>
            취소
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.contentBox}>
            <div className={styles.contentTitle}>매장 사업자번호 입력</div>
            <div className={styles.contentContent}>
              <input
                type="text"
                value={businessNumber}
                onChange={handleBusinessNumber}
                className={styles.numberInput}
                placeholder="매장의 사업자번호를 입력해 주세요"
              />
              <button className={styles.inputButton} onClick={openShop}>
                입력 완료
              </button>
            </div>
          </div>
          {/* 이 8줄을 입력 확인을 눌렀을 때 매장이 나오도록 하는 코드*/}
          <div className={styles.openShopBox}>
            <div className={styles.openBox}>
              <div className={styles.contentTitle}>매장명</div>
            </div>
            <div className={styles.openBox}>
              <div className={styles.openShop}>{shop}</div>
            </div>
          </div>
          {/* 매장이 나오도록 하는 코드 */}
          {/* 동시에 위 매장이 맞나요? 텍스트와 버튼 2개가 나타남 */}
          <div className={styles.openText}>위 매장이 맞나요?</div>
          <div className={styles.openButtonBox}>
            <Button width="216px" height="46px" children="네 맞습니다." />
            <Button
              width="216px"
              height="46px"
              children="아닙니다."
              variant="gray"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbaAddModal;
