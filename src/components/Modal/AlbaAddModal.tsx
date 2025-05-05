import styles from "./AlbaAddModal.module.css";
import { useState } from "react";
import Button from "../Button";
import axiosInstance from "../../api/axios";

interface AlbaAddModalProps {
  onClose: () => void;
}

const AlbaAddModal: React.FC<AlbaAddModalProps> = ({ onClose }) => {
  const [businessNumber, setBusinessNumber] = useState<string>("");
  const [shop, setShop] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  const handleBusinessNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 하이픈 자동 포맷팅 (000-00-00000)
    let value = e.target.value;
    // 숫자와 하이픈만 입력 가능하도록
    value = value.replace(/[^\d-]/g, '');
    
    // 하이픈 자동 추가
    if (value.length > 0) {
      // 기존 하이픈 제거
      value = value.replace(/-/g, '');
      
      // 숫자만 최대 10자리 제한
      if (value.length > 10) {
        value = value.substring(0, 10);
      }
      
      // 하이픈 추가 (XXX-XX-XXXXX 형식)
      if (value.length > 5) {
        value = `${value.substring(0, 3)}-${value.substring(3, 5)}-${value.substring(5)}`;
      } else if (value.length > 3) {
        value = `${value.substring(0, 3)}-${value.substring(3)}`;
      }
    }
    
    setBusinessNumber(value);
    // 입력 시 에러 메시지 초기화
    setValidationError("");
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // 매장이 틀렸을 경우 버튼을 눌러서 다시 없어지도록 설정
  const closeShop = () => {
    setIsOpen(false);
  };

  // 스탭별로 작업
  const [step, setStep] = useState<number>(1);

  // 사업자등록번호 검증 함수
  const validateBusinessNumber = async (number: string) => {
    // 하이픈 제거
    const cleanNumber = number.replace(/-/g, '');
    
    // 검증 기본 규칙 - 10자리 숫자 확인
    if (!/^\d{10}$/.test(cleanNumber)) {
      setValidationError("사업자등록번호는 10자리 숫자여야 합니다.");
      return false;
    }
    
    try {
      setIsValidating(true);
      
      // 백엔드 API를 통한 사업자번호 검증
      const response = await axiosInstance.post('/store/validate-business-number', {
        businessNumber: cleanNumber
      });
      
      // 검증 결과
      const isValid = response.data;
      
      if (!isValid) {
        setValidationError("유효하지 않은 사업자등록번호입니다.");
      }
      
      return isValid;
    } catch (error) {
      console.error("사업자등록번호 검증 중 오류 발생:", error);
      setValidationError("사업자등록번호 검증에 실패했습니다.");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // 사업자번호로 매장 정보 조회
  const fetchFakeShop = async () => {
    if (!businessNumber) {
      setValidationError("사업자등록번호를 입력해주세요.");
      return;
    }
    
    // 하이픈 제거
    const cleanNumber = businessNumber.replace(/-/g, '');
    
    // 사업자번호 검증
    const isValid = await validateBusinessNumber(businessNumber);
    
    if (!isValid) {
      return;
    }
    
    // 하드코딩된 데이터에서 매장 조회
    if (fakeShops[cleanNumber]) {
      setShop(fakeShops[cleanNumber]); // 매장명 설정
      setIsOpen(true);
    } else {
      // 검증은 성공했지만 DB에 없는 사업자번호일 경우 매장명 입력 기능 추가
      setValidationError("확인된 사업자번호이나 등록된 매장 정보가 없습니다. 매장명을 직접 입력해주세요.");
      setShop("");
      setIsOpen(true);
    }
  };

  // 사업자번호에 따른 하드코딩된 매장 정보
  const fakeShops: { [key: string]: string } = {
    "0000000000": "스타벅스 성신여대점",
    "1111111111": "투썸플레이스 성공회대점",
    "2222222222": "이디야 숙명여대점",
  };

  // 매장 정보 저장
  const registerShop = async () => {
    if (!shop && !document.getElementById('shopNameInput')) {
      setValidationError("매장명을 입력해주세요.");
      return;
    }
    
    // 직접 입력한 매장명 가져오기
    const inputElement = document.getElementById('shopNameInput') as HTMLInputElement;
    const shopName = inputElement ? inputElement.value : shop;
    
    if (!shopName) {
      setValidationError("매장명을 입력해주세요.");
      return;
    }

    try {
      await axiosInstance.post("/store", {
        businessNumber: businessNumber.replace(/-/g, ''),
        shopName: shopName,
      });

      setStep(2); // 등록 완료 화면으로 이동
    } catch (error) {
      console.error("매장 등록 중 오류 발생:", error);
      setValidationError("매장 등록에 실패했습니다.");
    }
  };

  // 매장명 직접 입력 상태
  const [isDirectInput, setIsDirectInput] = useState<boolean>(false);
  
  // 매장명 직접 입력 전환
  const toggleDirectInput = () => {
    setIsDirectInput(!isDirectInput);
    if (!isDirectInput) {
      setShop("");
    }
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
                placeholder="매장의 사업자번호를 입력해 주세요 (000-00-00000)"
              />
              <button 
                className={styles.inputButton} 
                onClick={fetchFakeShop}
                disabled={isValidating}
              >
                {isValidating ? "검증 중..." : "입력 완료"}
              </button>
            </div>
            {validationError && (
              <div className={styles.errorMessage}>{validationError}</div>
            )}
          </div>
          
          {/* 입력 확인을 눌렀을 때 매장이 나오도록 하는 코드 */}
          {isOpen && (
            <>
              <div className={styles.openShopBox}>
                <div className={styles.openBox}>
                  <div className={styles.contentTitle}>매장명</div>
                  {isDirectInput && (
                    <div className={styles.directInputToggle} onClick={toggleDirectInput}>
                      저장된 매장명 사용
                    </div>
                  )}
                  {!isDirectInput && shop && (
                    <div className={styles.directInputToggle} onClick={toggleDirectInput}>
                      직접 입력
                    </div>
                  )}
                </div>
                <div className={styles.openBox}>
                  {isDirectInput || !shop ? (
                    <input 
                      id="shopNameInput"
                      type="text" 
                      className={styles.shopNameInput}
                      placeholder="매장명을 입력해주세요"
                      defaultValue={shop}
                    />
                  ) : (
                    <div className={styles.openShop}>{shop}</div>
                  )}
                </div>
              </div>

              {/* 매장이 나오도록 하는 코드 */}
              {/* 동시에 "위 매장이 맞나요?" 텍스트와 두 개의 버튼이 나타남 */}
              <div className={styles.openText}>근무지가 위 매장이 맞나요?</div>
              {step === 1 && (
                <div className={styles.openButtonBox}>
                  <Button
                    width="216px"
                    height="46px"
                    children="네 맞습니다."
                    onClick={registerShop}
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
