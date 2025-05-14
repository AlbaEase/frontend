import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EmployeeMyCh.module.css";
import { fetchModificationRequests, fetchShiftRequests, requestModification, checkAuthAndSetToken } from "../../api/apiService";
import { ModificationDisplay, ShiftResponse, Schedule } from "../../types/api";

interface FormDataType {
  scheduleId: number;
  details: string;
  storeId: number;
  startTime: string;
  endTime: string;
  workDate: string;
}

const EmployeeMyCh = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({
    scheduleId: 0,
    details: "",
    storeId: 0, // URL에 필요한 storeId
    // 참고용 데이터 (API 요청에는 사용되지 않음)
    startTime: "",
    endTime: "",
    workDate: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [changeRequests, setChangeRequests] = useState<ModificationDisplay[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // 인증 상태 확인
  useEffect(() => {
    const isAuthenticated = checkAuthAndSetToken();
    if (!isAuthenticated) {
      console.warn("🚨 인증되지 않은 사용자: 로그인 페이지로 리디렉션합니다.");
      navigate("/login");
    }
  }, [navigate]);

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      setError("");
      
      try {
        // 인증 상태 확인
        const isAuthenticated = checkAuthAndSetToken();
        if (!isAuthenticated) {
          throw new Error("인증이 필요합니다. 로그인 후 다시 시도해주세요.");
        }
        
        console.log("✅ 근무 변경 요청 및 대타 요청 데이터 로딩 시작...");
        
        // 근무 변경 요청 데이터 가져오기
        const modificationData = await fetchModificationRequests();
        console.log(`✅ ${modificationData.length}개의 근무 변경 요청 데이터 로드됨`);
        
        // 대타 요청 데이터 가져오기
        const shiftData = await fetchShiftRequests();
        console.log(`✅ ${shiftData.length}개의 대타 요청 데이터 로드됨`);
        
        // 데이터 변환 및 합치기
        const displayData: ModificationDisplay[] = [];
        
        // 근무 변경 요청 데이터 변환
        modificationData.forEach(mod => {
          try {
            const workDate = mod.schedule?.workDate || 'Unknown';
            const startTime = mod.schedule?.startTime || '';
            const endTime = mod.schedule?.endTime || '';
            
            // 날짜 문자열을 Date 객체로 변환
            const date = new Date(workDate);
            // 한국 시간으로 변환 (UTC+9)
            const koreanDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
            // 날짜 형식 지정 (YY.MM.DD)
            const year = koreanDate.getUTCFullYear().toString().substring(2);
            const month = (koreanDate.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = koreanDate.getUTCDate().toString().padStart(2, '0');
            
            const formattedDate = `${year}.${month}.${day} / ${startTime}~${endTime}`;
            
            displayData.push({
              id: mod.modificationId,
              workDate: formattedDate,
              requester: mod.userName || 'Unknown',
              substitute: '-', // 근무 변경은 대체자가 없음
              status: mod.status
            });
          } catch (err) {
            console.error('근무 변경 요청 데이터 변환 중 오류:', err, mod);
          }
        });
        
        // 대타 요청 데이터 변환
        shiftData.forEach(shift => {
          try {
            const workDate = shift.schedule?.workDate || shift.requestDate || 'Unknown';
            const startTime = shift.schedule?.startTime || '';
            const endTime = shift.schedule?.endTime || '';
            
            // 날짜 문자열을 Date 객체로 변환
            const date = new Date(workDate);
            // 한국 시간으로 변환 (UTC+9)
            const koreanDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
            // 날짜 형식 지정 (YY.MM.DD)
            const year = koreanDate.getUTCFullYear().toString().substring(2);
            const month = (koreanDate.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = koreanDate.getUTCDate().toString().padStart(2, '0');
            
            const formattedDate = `${year}.${month}.${day} / ${startTime}~${endTime}`;
            
            displayData.push({
              id: shift.shiftId,
              workDate: formattedDate,
              requester: shift.fromUserName || 'Unknown',
              substitute: shift.toUserName || '전체',
              status: shift.status
            });
          } catch (err) {
            console.error('대타 요청 데이터 변환 중 오류:', err, shift);
          }
        });
        
        // 데이터 저장 및 로딩 상태 업데이트
        setChangeRequests(displayData);
        
        // 저장된 스케줄 정보들 (모달에서 사용)
        const scheduleList: Schedule[] = [
          ...(modificationData.map(mod => mod.schedule).filter(Boolean) as Schedule[]),
          ...(shiftData.map(shift => shift.schedule).filter(Boolean) as Schedule[])
        ];
        
        setSchedules(scheduleList);
        console.log(`✅ ${scheduleList.length}개의 스케줄 정보 로드됨`);
      } catch (err) {
        console.error('데이터 로딩 중 오류:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadData();
  }, [navigate]);

  // 모달 열기 함수 - 스케줄 선택 시 호출
  const openModal = (scheduleId: number, storeId: number, startTime: string, endTime: string, workDate: string) => {
    setFormData({
      scheduleId,
      storeId,
      startTime,
      endTime,
      workDate,
      details: ""
    });
    setIsModalOpen(true);
  };

  // 기존 스케줄 선택 처리
  const handleScheduleSelect = (schedule: Schedule) => {
    if (!schedule) return;
    
    openModal(
      schedule.scheduleId,
      schedule.storeId,
      schedule.startTime,
      schedule.endTime,
      schedule.workDate
    );
  };

  // 폼 입력값 변경 처리
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 변경 요청 제출
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // 인증 상태 확인
      const isAuthenticated = checkAuthAndSetToken();
      if (!isAuthenticated) {
        throw new Error("인증이 필요합니다. 로그인 후 다시 시도해주세요.");
      }
      
      // 필수 값 검증
      if (!formData.scheduleId || !formData.details || !formData.storeId) {
        throw new Error("모든 필수 정보를 입력해주세요");
      }
      
      console.log("✅ 근무 변경 요청 전송 중...", {
        storeId: formData.storeId,
        scheduleId: formData.scheduleId,
        details: formData.details
      });
      
      // API 호출
      await requestModification(formData.storeId, {
        scheduleId: formData.scheduleId,
        details: formData.details
      });
      
      setSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
        // 데이터 다시 로드
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "요청 처리 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 요청 상태에 따른 스타일 클래스
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'APPROVED': return styles.approved;
      case 'REJECTED': return styles.rejected;
      default: return styles.pending;
    }
  };

  return (
    <div className={styles.employeeMych}>
      <div className={styles.change}>
        <div className={styles.changeTitle}>근무변경 요청내역</div>
        <div className={styles.changeButton}>승인내역|거절내역</div>
      </div>
      <div className={styles.title}>
        <div className={styles.titleD}>근무일자</div>
        <div className={styles.titleR}>요청자</div>
        <div className={styles.titleA}>대체 근무자</div>
      </div>
      <div className={styles.content}>
        {isLoadingData ? (
          <div className={styles.loadingMessage}>데이터 로딩 중...</div>
        ) : error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : changeRequests.length > 0 ? (
          changeRequests.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.contents} ${getStatusClass(item.status)}`}
            >
              <div className={styles.contentsD}>{item.workDate}</div>
              <div className={styles.contentsR}>{item.requester}</div>
              <div className={styles.contentsA}>{item.substitute}</div>
            </div>
          ))
        ) : (
          <div className={styles.emptyMessage}>요청 내역이 없습니다.</div>
        )}
      </div>

      {/* 근무 변경 요청 버튼 */}
      <button 
        className={styles.requestButton}
        onClick={() => {
          // 기본 스케줄이 있으면 그 중 첫 번째 선택, 없으면 기본값 사용
          if (schedules.length > 0) {
            handleScheduleSelect(schedules[0]);
          } else {
            openModal(1, 1, "09:00", "18:00", "2024-05-15");
          }
        }}
      >
        근무 변경 요청하기
      </button>

      {/* 근무 변경 요청 모달 */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>근무 변경 요청</h3>
            
            {success ? (
              <div className={styles.successMessage}>
                변경 요청이 성공적으로 제출되었습니다.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>근무 일자</label>
                  <input 
                    type="text" 
                    value={formData.workDate} 
                    readOnly 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>현재 근무 시간</label>
                  <input 
                    type="text" 
                    value={`${formData.startTime} ~ ${formData.endTime}`} 
                    readOnly 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>변경 요청 내용</label>
                  <textarea 
                    name="details" 
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="변경하고 싶은 시간과 사유를 자세히 적어주세요."
                    required
                  />
                </div>
                
                {error && <div className={styles.errorMessage}>{error}</div>}
                
                <div className={styles.modalButtons}>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    disabled={isLoading}
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "처리 중..." : "제출하기"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeMyCh;
