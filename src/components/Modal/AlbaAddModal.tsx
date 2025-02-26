import styles from "./AlbaAddModal.module.css";
import { useState, useEffect } from "react";
import Button from "../Button";
import { useOwnerSchedule } from "../../contexts/OwnerScheduleContext"; // 매장 정보를 관리하는 context
import SelectRadio from "../SelectRadio"; // SelectRadio import

interface AlbaAddModalProps {
  onClose: () => void;
}

const AlbaAddModal: React.FC<AlbaAddModalProps> = ({ onClose }) => {
  const { stores, selectedStore, setSelectedStore } = useOwnerSchedule(); // 가게 정보와 선택된 매장 상태
  const [businessNumber, setBusinessNumber] = useState<string>("");
  const [shop, setShop] = useState<string>("이디야");

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

  // 사업자번호로 매장 정보 조회
  // 현재 매장 api가 준비되지 않아서 하드코딩으로 미리 매장을 준비해서 사용함
  // 나중에 연동이 되는대로 사용해보기
  // const fetchShop = async () => {
  //   try {
  //     const res = await fetch(
  //       `http://localhost:8080/shop?businessNumber=${businessNumber}`
  //     );
  //     const data = await res.json();

  //     if (res.ok && data) {
  //       setShop(data.name); // 서버에서 받은 매장명 설정
  //       setIsOpen(true);
  //     } else {
  //       alert("매장을 찾을 수 없습니다. 사업자번호를 확인해주세요.");
  //     }
  //   } catch (error) {
  //     console.error("매장 정보를 불러오는 데 실패했습니다.", error);
  //     alert("오류가 발생했습니다.");
  //   }
  // };

  // 사업자번호에 따른 하드코딩된 매장 정보
  const fakeShops: { [key: string]: string } = {
    "0000000000": "스타벅스 성신여대점",
    "1111111111": "투썸플레이스 성공회대점",
    "2222222222": "이디야 숙명여대점",
  };

  const fetchFakeShop = async () => {
    // 하드코딩된 데이터에서 매장 조회
    if (fakeShops[businessNumber]) {
      setShop(fakeShops[businessNumber]); // 매장명 설정
      setIsOpen(true);
    } else {
      alert("매장을 찾을 수 없습니다. 사업자번호를 확인해주세요.");
    }
  };

  // 매장 정보 저장
  const registerShop = async () => {
    if (!shop) return;

    try {
      const res = await fetch("http://localhost:8080/register-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessNumber, shopName: shop }),
      });

      if (res.ok) {
        setStep(2); // 등록 완료 화면으로 이동
      } else {
        alert("매장 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("매장 등록 중 오류 발생:", error);
      alert("오류가 발생했습니다.");
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
                placeholder="매장의 사업자번호를 입력해 주세요"
              />
              <button className={styles.inputButton} onClick={fetchFakeShop}>
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
