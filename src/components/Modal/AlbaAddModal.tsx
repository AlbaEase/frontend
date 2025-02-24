import styles from "./AlbaAddModal.module.css";
import { useState } from "react";
import Button from "../Button";

interface AlbaAddModalProps {
  onClose: () => void;
}

const AlbaAddModal: React.FC<AlbaAddModalProps> = ({ onClose }) => {
  const [businessNumber, setBusinessNumber] = useState<string>("");

  const [shop, setShop] = useState<string>("여기에는 가게가 들어갑니다.");

  const handleBusinessNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessNumber(e.target.value);
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 입력완료에서 사용하는 핸들러 함수 -> false로 기본설정이 되어있던 것이 true로 바뀌면서 랜더링
  const openShop = () => {
    setIsOpen(true);
  };
  // 매장이 틀렸을 경우 버튼을 눌러서 다시 없어지도록 설정
  const closeShop = () => {
    setIsOpen(false);
  };

  // 스탭별로 작업
  const [step, setStep] = useState<number>(1);
  // 다음스탭으로 넘어가는 핸들러 함수
  const handleNext = () => {
    setStep(step + 1);
  };

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
          {isOpen && (
            <>
              <div className={styles.openShopBox}>
                <div className={styles.openBox}>
                  <div className={styles.contentTitle}>매장명</div>
                </div>
                <div className={styles.openBox}>
                  <div className={styles.openShop}>{shop}</div>
                </div>
              </div>

              {/* 매장이 나오도록 하는 코드 */}
              {/* 동시에 "위 매장이 맞나요?" 텍스트와 두 개의 버튼이 나타남 */}
              <div className={styles.openText}>근무지가 위 매장이 맞나요??</div>
              {step === 1 && (
                <div className={styles.openButtonBox}>
                  <Button
                    width="216px"
                    height="46px"
                    children="네 맞습니다."
                    onClick={handleNext}
                  />
                  <Button
                    width="216px"
                    height="46px"
                    children="아닙니다."
                    variant="gray"
                    onClick={closeShop}
                  />
                </div>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <div className={styles.openButtonBox}>
                <Button width="216px" height="46px" children="네 맞습니다." />
              </div>
              <div className={styles.step2Box}>
                <div className={styles.done}>매장등록이 완료되었습니다.</div>
                <div className={styles.move} onClick={onClose}>
                  메인페이지로 이동하기.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbaAddModal;
