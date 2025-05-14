import React, { useState, useEffect } from "react";
import styles from "./RequestModal.module.css";
import "react-datepicker/dist/react-datepicker.css";
import CustomSelect from "../CustomSelect";
import CustomSelectWorker from "../CustomSelectWorker";
import { requestShift, requestModification } from "../../api/apiService";
import axios from "axios";
import { getToken, getUserInfo } from "../../api/loginAxios";
import { ShiftRequest } from "../../types/api"; // ShiftRequest 타입 추가 임포트
import { useOwnerSchedule } from "../../contexts/OwnerScheduleContext";
import { useModal } from "../../contexts/ModalContext";
import { API_URL } from "../../utils/config";

// 근무자 정보 인터페이스
interface WorkerInfo {
    id: string; // CustomSelectWorker와 호환되도록 string 타입으로 변경
    name: string;
}

// 워커 검색 결과 타입 정의
interface Worker {
    name: string;
    id: string | number;
}

interface CalendarScheduleProps {
    onClose: () => void;
}

// 사용자 정보 가져오기 함수 - API 호출로 사용자 정보 조회
const fetchCurrentUserId = async (): Promise<number | null> => {
    try {
        const token = getToken();
        if (!token) {
            console.error("인증 토큰이 없습니다");
            return null;
        }
        
        try {
            // /user/me 엔드포인트를 통해 사용자 정보 요청
            console.log("GET /user/me API 호출 시작");
            const response = await axios.get(`${API_URL}/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data && response.data.id !== undefined) {
                console.log("사용자 정보 조회 성공:", response.data);
                
                // 응답 데이터에서 userId 필드도 확인
                const userId = response.data.id || response.data.userId;
                
                // 로컬 스토리지 사용자 정보 업데이트
                const userInfo = getUserInfo();
                if (userInfo) {
                    userInfo.userId = userId;
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));
                    console.log("로컬 스토리지 사용자 정보 업데이트:", userInfo);
                }
                
                return Number(userId);
            }
            
            console.warn("/user/me API에서 ID 필드를 찾을 수 없습니다");
            
            // 사용자 정보를 로컬 스토리지에서 확인
            const userInfo = getUserInfo();
            if (userInfo && userInfo.userId !== undefined && userInfo.userId !== null) {
                console.log("로컬 스토리지에서 사용자 ID 확인:", userInfo.userId);
                return Number(userInfo.userId);
            }
            
            // 토큰 디코딩을 통한 사용자 ID 추출 시도
            try {
                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    if (payload.userId || payload.user_id || payload.id || payload.sub) {
                        const extractedId = payload.userId || payload.user_id || payload.id || payload.sub;
                        console.log("JWT 토큰에서 userId 추출:", extractedId);
                        
                        // 로컬 스토리지 업데이트
                        if (userInfo) {
                            userInfo.userId = Number(extractedId);
                            localStorage.setItem("userInfo", JSON.stringify(userInfo));
                            console.log("JWT 토큰 정보로 로컬 스토리지 업데이트");
                        }
                        
                        return Number(extractedId);
                    }
                }
            } catch (tokenError) {
                console.warn("JWT 토큰 디코딩 실패:", tokenError);
            }
            
            // 스토어 API를 통한 사용자 정보 조회 시도
            try {
                console.log("스토어 API를 통한 사용자 정보 조회 시도");
                const storeResponse = await axios.get(`${API_URL}/store/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (storeResponse.data && storeResponse.data.userId) {
                    console.log("스토어 API에서 사용자 ID 발견:", storeResponse.data.userId);
                    
                    // 로컬 스토리지 업데이트
                    if (userInfo) {
                        userInfo.userId = Number(storeResponse.data.userId);
                        localStorage.setItem("userInfo", JSON.stringify(userInfo));
                    }
                    
                    return Number(storeResponse.data.userId);
                }
            } catch (storeError) {
                console.warn("스토어 API 조회 실패:", storeError);
            }
            
            console.warn("모든 방법으로 사용자 ID 조회 실패");
            return null;
        } catch (error) {
            console.warn("사용자 정보 조회 API 실패:", error);
            
            // 사용자 정보를 로컬 스토리지에서 확인 (API 실패 시)
            const userInfo = getUserInfo();
            if (userInfo && userInfo.userId !== undefined && userInfo.userId !== null) {
                console.log("로컬 스토리지에서 사용자 ID 확인 (API 실패 후):", userInfo.userId);
                return Number(userInfo.userId);
            }
            
            // 토큰 디코딩을 통한 사용자 ID 추출 시도 (백업)
            try {
                const token = getToken();
                if (token) {
                    const tokenParts = token.split('.');
                    if (tokenParts.length === 3) {
                        const payload = JSON.parse(atob(tokenParts[1]));
                        if (payload.userId || payload.user_id || payload.id || payload.sub) {
                            const extractedId = payload.userId || payload.user_id || payload.id || payload.sub;
                            console.log("JWT 토큰에서 userId 추출 (API 실패 후):", extractedId);
                            return Number(extractedId);
                        }
                    }
                }
            } catch (tokenError) {
                console.warn("JWT 토큰 디코딩 실패 (API 실패 후):", tokenError);
            }
            
            return null;
        }
    } catch (error) {
        console.error(`사용자 정보를 가져오는 중 오류 발생:`, error);
        return null;
    }
};

const RequestModal: React.FC<CalendarScheduleProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    // const [selectedName, setSelectedName] = useState(""); // 교환을 요청할 근무자 (기존 근무자)
    const [selectedOption, setSelectedOption] = useState<
        "all" | "select" | null // 요청 대상 선택 체크박스
    >(null);
    const [selectedWorker, setSelectedWorker] = useState<string[]>([]);
    const [selectedWorkerNames, setSelectedWorkerNames] = useState<string[]>([]);
    const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null); // 선택된 근무자의 ID
    const [requestDetails, setRequestDetails] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [workerList, setWorkerList] = useState<WorkerInfo[]>([]);

    const { currentDate, selectedName, setSelectedName, otherGroupMembers, ownerSchedules } =
        useOwnerSchedule();
    const { modalData } = useModal();
    
    // otherGroupMembers를 WorkerInfo[] 형식으로 변환
    useEffect(() => {
        if (otherGroupMembers && otherGroupMembers.length > 0) {
            // 디버깅: 모달 데이터 구조 확인
            console.log("modalData 구조:", modalData);
            console.log("otherGroupMembers:", otherGroupMembers);
            console.log("전체 ownerSchedules:", ownerSchedules);
            
            // 형식 변환: 사용자 이름에서 ID와 이름이 포함된 객체로
            const formattedWorkers: WorkerInfo[] = [];
            
            otherGroupMembers.forEach(memberName => {
                // 모달 데이터에서 근무자 정보 찾기
                let workerId: string = memberName; // 기본값으로 이름 사용
                let foundWorker = false;
                
                // 1. ownerSchedules에서 사용자 ID 찾기 (가장 정확한 방법)
                const workerSchedule = ownerSchedules.find(schedule => schedule.fullName === memberName);
                if (workerSchedule && workerSchedule.userId !== undefined) {
                    workerId = workerSchedule.userId.toString();
                    foundWorker = true;
                    console.log(`ownerSchedules에서 근무자 ${memberName}의 ID를 찾음: ${workerId}`);
                }
                
                // 2. 모달 데이터에서 workers 배열 찾기
                if (!foundWorker && modalData && Array.isArray(modalData)) {
                    // 모든 가능한 workers 배열 위치 확인
                    modalData.forEach(item => {
                        // 2-1. 직접 workers 배열이 있는 경우
                        if (item.workers && Array.isArray(item.workers)) {
                            const worker = item.workers.find((w: Worker) => w.name === memberName);
                            if (worker && worker.id !== undefined) {
                                workerId = worker.id.toString();
                                foundWorker = true;
                                console.log(`modalData.workers에서 근무자 ${memberName}의 ID를 찾음: ${workerId}`);
                            }
                        }
                        
                        // 2-2. groups 배열 안에 workers가 있는 경우
                        if (!foundWorker && item.groups && Array.isArray(item.groups)) {
                            item.groups.forEach((group: { workers?: Worker[] }) => {
                                if (group.workers && Array.isArray(group.workers)) {
                                    const worker = group.workers.find((w: Worker) => w.name === memberName);
                                    if (worker && worker.id !== undefined) {
                                        workerId = worker.id.toString();
                                        foundWorker = true;
                                        console.log(`modalData.groups.workers에서 근무자 ${memberName}의 ID를 찾음: ${workerId}`);
                                    }
                                }
                            });
                        }
                    });
                }
                
                // 3. 직접 ID 생성 시도 (workers 배열이 없는 경우)
                if (!foundWorker) {
                    // 백엔드에서 사용자 ID 조회 시도 (예: 로컬 스토리지에 저장된 사용자 목록 등)
                    try {
                        const userListStr = localStorage.getItem("userList");
                        if (userListStr) {
                            const userList = JSON.parse(userListStr);
                            const foundUser = userList.find((u: Worker) => u.name === memberName);
                            if (foundUser && foundUser.id !== undefined) {
                                workerId = foundUser.id.toString();
                                foundWorker = true;
                                console.log(`로컬 스토리지에서 근무자 ${memberName}의 ID를 찾음: ${workerId}`);
                            }
                        }
                    } catch (error) {
                        console.error("로컬 스토리지에서 사용자 목록을 읽는 중 오류 발생:", error);
                    }
                    
                    // 여전히 ID를 찾지 못한 경우 임시 ID 생성 
                    if (!foundWorker) {
                        // 이름에서 가짜 숫자 ID 생성 (실제 ID가 필요하므로 임의의 숫자로 할당)
                        const fakeId = `${Math.floor(Math.random() * 1000) + 1000}`; // 1000-1999 사이의 임의 ID
                        console.warn(`근무자 ${memberName}의 ID를 찾을 수 없어 임시 ID 생성: ${fakeId}`);
                        workerId = fakeId;
                    }
                }
                
                formattedWorkers.push({
                    id: workerId,
                    name: memberName
                });
            });
            
            console.log("변환된 근무자 목록:", formattedWorkers);
            setWorkerList(formattedWorkers);
        }
    }, [otherGroupMembers, modalData, ownerSchedules]);

    const handleNameChange = (name: string) => {
        setSelectedName(name);
        
        // 선택된 이름에 해당하는 사용자 ID 찾기
        if (modalData && Array.isArray(modalData)) {
            modalData.forEach(item => {
                if (item.workers && Array.isArray(item.workers)) {
                    const worker = item.workers.find((w: Worker) => w.name === name);
                    if (worker && worker.id) {
                        console.log(`선택된 근무자 ${name}의 ID: ${worker.id}`);
                    }
                }
            });
        }
    };

    const handleCheckboxChange = (option: "all" | "select") => {
        setSelectedOption(option); // 둘 중 하나만 선택하도록
        if (option === "all") {
            // 전체 근무자 선택 시 빈 배열로 설정 (모든 근무자 대상)
            setSelectedWorker([]);
            setSelectedWorkerNames([]);
        } else {
            setSelectedWorker([]);
            setSelectedWorkerNames([]);
        }
    };

    const handleRequestDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRequestDetails(e.target.value);
    };
    
    // 근무자 선택 시 ID도 함께 저장
    useEffect(() => {
        if (selectedWorker.length > 0) {
            // 선택된 ID
            const selectedId = selectedWorker[0];
            console.log("선택된 근무자 ID(문자열):", selectedId);
            
            // 선택된 이름에 해당하는 근무자 찾기
            const selectedWorkerInfo = workerList.find(worker => worker.id === selectedId);
            console.log("찾은 근무자 정보:", selectedWorkerInfo);
            
            if (selectedWorkerInfo) {
                // 숫자로 변환 시도
                const workerId = parseInt(selectedWorkerInfo.id);
                
                if (!isNaN(workerId)) {
                    console.log(`선택된 근무자 ID(숫자): ${workerId}`);
                    setSelectedWorkerId(workerId);
                } else {
                    // 숫자로 변환할 수 없는 경우, 원래 ID가 이름인 경우 다른 방법으로 ID 찾기 시도
                    console.warn("선택된 근무자 ID를 숫자로 변환할 수 없습니다. 다른 방법으로 ID 찾기 시도");
                    
                    // modalData에서 직접 찾기
                    if (modalData && Array.isArray(modalData)) {
                        let foundId = null;
                        
                        modalData.forEach(item => {
                            if (item.workers && Array.isArray(item.workers)) {
                                const worker = item.workers.find((w: Worker) => w.name === selectedWorkerInfo.name);
                                if (worker && worker.id !== undefined) {
                                    foundId = worker.id;
                                    console.log(`modalData에서 ${selectedWorkerInfo.name}의 ID를 찾음: ${foundId}`);
                                }
                            }
                        });
                        
                        if (foundId !== null) {
                            setSelectedWorkerId(Number(foundId));
                        } else {
                            setSelectedWorkerId(null);
                            console.error("근무자 ID를 찾을 수 없습니다:", selectedWorkerInfo.name);
                        }
                    } else {
                        setSelectedWorkerId(null);
                    }
                }
            } else {
                console.warn("선택된 근무자의 정보를 찾을 수 없습니다.");
                setSelectedWorkerId(null);
            }
        } else {
            setSelectedWorkerId(null);
        }
    }, [selectedWorker, workerList, modalData]);

    // 백엔드로 대타 요청 또는 근무 수정 요청 전송
    const sendRequest = async () => {
        if (!modalData || modalData.length === 0) {
            setError("스케줄 정보를 찾을 수 없습니다.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 디버깅: modalData 구조 확인
            console.log("전체 modalData:", modalData);
            console.log("modalData[0]:", modalData[0]);
            
            // 현재 날짜에 해당하는 스케줄 찾기
            const currentDateStr = currentDate.format("YYYY-MM-DD");
            console.log("현재 날짜:", currentDateStr);
            
            // 현재 매장 ID 가져오기
            const storeId = modalData[0]?.storeId || 1; // 기본값 1
            console.log("매장 ID:", storeId);
            
            // 스케줄 ID 찾기
            let scheduleId;
            
            // 모달 데이터 디버깅
            console.log("모달 데이터 타입:", typeof modalData, Array.isArray(modalData));
            console.log("모달 데이터 첫 항목:", modalData[0]);
            
            // 1. modalData가 배열인 경우 (그룹화된 스케줄)
            if (Array.isArray(modalData) && modalData[0]?.scheduleIds && modalData[0]?.scheduleIds.length > 0) {
                scheduleId = modalData[0].scheduleIds[0];
                console.log("케이스 1: scheduleIds 배열에서 추출", scheduleId);
            } 
            // 2. modalData가 객체인 경우 (단일 스케줄)
            else if (modalData && typeof modalData === 'object' && 'scheduleId' in modalData) {
                scheduleId = modalData.scheduleId;
                console.log("케이스 2: scheduleId 직접 추출", scheduleId);
            }
            // 3. scheduleIds 배열이 있는 경우
            else if (modalData[0]?.groups && modalData[0]?.groups[0]?.scheduleIds) {
                scheduleId = modalData[0].groups[0].scheduleIds[0];
                console.log("케이스 3: groups.scheduleIds에서 추출", scheduleId);
            }
            // 4. id 필드로 저장된 경우
            else if (modalData[0]?.id) {
                scheduleId = modalData[0].id;
                console.log("케이스 4: id에서 추출", scheduleId);
            }
            // 5. 스케줄ID 배열이 직접 있는 경우
            else if (modalData[0]?.schedule?.scheduleId) {
                scheduleId = modalData[0].schedule.scheduleId;
                console.log("케이스 5: schedule.scheduleId에서 추출", scheduleId);
            }
            // 6. 그 외의 경우 에러 처리
            else {
                console.error("스케줄 ID를 찾을 수 없습니다:", modalData);
                setError("스케줄 ID를 찾을 수 없습니다. 관리자에게 문의하세요.");
                setLoading(false);
                return;
            }
            
            // 스케줄 ID가 문자열인 경우 숫자로 변환
            if (typeof scheduleId === 'string') {
                scheduleId = parseInt(scheduleId);
                if (isNaN(scheduleId)) {
                    setError("유효한 스케줄 ID가 아닙니다.");
                    setLoading(false);
                    return;
                }
            }
            
            console.log("사용할 스케줄 ID:", scheduleId);
            
            // 현재 사용자 정보 가져오기
            const userInfo = getUserInfo();
            if (!userInfo) {
                setError("사용자 정보를 찾을 수 없습니다.");
                setLoading(false);
                return;
            }
            
            console.log("사용자 정보:", userInfo);
            
            // 사용자 ID 가져오기
            let fromUserId = userInfo.userId;
            
            // 사용자 ID가 없고 이메일이 있는 경우 API를 통해 사용자 ID 조회
            if ((fromUserId === undefined || fromUserId === null) && userInfo.email) {
                console.log("userId가 없음, 이메일로 ID 조회:", userInfo.email);
                
                // 서버 API에서 사용자 ID 조회
                const userId = await fetchCurrentUserId();
                
                if (userId !== null) {
                    fromUserId = userId;
                    // 사용자 정보 업데이트
                    userInfo.userId = userId;
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));
                    console.log("사용자 ID 조회 성공:", fromUserId);
                }
            }
            
            // 요청자 ID 유효성 검사
            if (fromUserId === undefined || fromUserId === null) {
                console.error("유효한 요청자 ID가 없습니다:", userInfo);
                setError("유효한 요청자 ID가 없습니다. 다시 로그인해 주세요.");
                setLoading(false);
                return;
            }
            
            // 명시적으로 숫자로 변환
            fromUserId = Number(fromUserId);
            
            if (isNaN(fromUserId)) {
                console.error("요청자 ID가 유효한 숫자가 아닙니다:", fromUserId);
                setError("요청자 ID가 유효한 숫자가 아닙니다. 다시 로그인해 주세요.");
                setLoading(false);
                return;
            }
            
            console.log(`최종 사용할 요청자 ID: ${fromUserId} (타입: ${typeof fromUserId})`);

            if (selectedOption === "select" && selectedWorker.length > 0) {
                // 특정 근무자 대상 대타 요청
                let toUserId = selectedWorkerId;
                
                // selectedWorkerId가 없는 경우 다시 한번 찾기 시도
                if (!toUserId) {
                    console.warn("선택한 근무자의 ID를 찾을 수 없어 다시 시도합니다.");
                    
                    // 선택된 근무자 정보 찾기
                    const selectedId = selectedWorker[0];
                    const selectedWorkerInfo = workerList.find(worker => worker.id === selectedId);
                    
                    if (selectedWorkerInfo) {
                        // 1. 숫자로 변환 시도
                        const parsedId = parseInt(selectedWorkerInfo.id);
                        if (!isNaN(parsedId)) {
                            toUserId = parsedId;
                            console.log(`근무자 ID를 숫자로 변환: ${toUserId}`);
                        } 
                        // 2. 이름으로 modalData에서 직접 찾기
                        else {
                            const workerName = selectedWorkerInfo.name;
                            
                            // modalData에서 workers 배열 검색
                            if (modalData && Array.isArray(modalData)) {
                                for (const item of modalData) {
                                    if (item.workers && Array.isArray(item.workers)) {
                                        const worker = item.workers.find((w: Worker) => w.name === workerName);
                                        if (worker && worker.id !== undefined) {
                                            toUserId = Number(worker.id);
                                            console.log(`modalData에서 ${workerName}의 ID를 찾음: ${toUserId}`);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
                // 여전히 ID를 찾지 못한 경우
                if (!toUserId) {
                    console.error("선택한 근무자의 ID를 찾을 수 없습니다. 선택된 근무자:", selectedWorker);
                    setError("선택한 근무자의 ID를 찾을 수 없습니다.");
                    setLoading(false);
                    return;
                }
                
                // 자기 자신에게 요청하는지 확인
                if (fromUserId === toUserId) {
                    setError("자기 자신에게 대타 요청을 할 수 없습니다.");
                    setLoading(false);
                    return;
                }
                
                console.log("특정 근무자에게 대타 요청:", {
                    fromUserId,
                    toUserId,
                    scheduleId,
                    requestType: "SPECIFIC_USER",
                    requestDate: currentDate.format("YYYY-MM-DD")
                });
                
                try {
                    // 요청 데이터 구성 - 필수 필드만 포함하고 숫자 타입 명시적 지정
                    const requestData: ShiftRequest = {
                        fromUserId: Number(fromUserId),
                        toUserId: Number(toUserId),
                        scheduleId: Number(scheduleId),
                        requestType: "SPECIFIC_USER",
                        requestDate: currentDate.format("YYYY-MM-DD")
                    };
                    
                    // 디버깅: 최종 요청 데이터 출력
                    console.log("대타 요청 최종 데이터:", {
                        fromUserId: requestData.fromUserId, 
                        fromUserIdType: typeof requestData.fromUserId,
                        toUserId: requestData.toUserId, 
                        toUserIdType: typeof requestData.toUserId,
                        scheduleId: requestData.scheduleId, 
                        scheduleIdType: typeof requestData.scheduleId
                    });
                    
                    // 스케줄 ID가 0이 아닌지 확인
                    if (requestData.scheduleId === undefined || requestData.scheduleId === null || isNaN(requestData.scheduleId)) {
                        throw new Error("유효한 스케줄 ID가 필요합니다.");
                    }
                    
                    // toUserId가 유효한지 확인
                    if (requestData.toUserId === undefined || requestData.toUserId === null || isNaN(requestData.toUserId)) {
                        throw new Error("대상 사용자 ID가 필요합니다.");
                    }
                    
                    // 자기 자신에게 요청하는지 확인
                    if (requestData.fromUserId === requestData.toUserId) {
                        throw new Error("자기 자신에게 대타 요청을 할 수 없습니다.");
                    }
                    
                    console.log("대타 요청 데이터:", JSON.stringify(requestData, null, 2));
                    
                    // apiService의 requestShift 함수 사용
                    const response = await requestShift(storeId, requestData);
                    console.log("대타 요청 응답:", response);
                    
                    // 요청 성공 처리
                    setSuccess(true);
                    setLoading(false);
                    setTimeout(() => {
                        onClose(); // 요청 성공 후 모달 닫기
                    }, 2000);
                    
                } catch (apiError) {
                    console.error("API 호출 오류:", apiError);
                    
                    // 상세 에러 정보 로깅
                    setError("대타 요청 중 오류가 발생했습니다.");
                    setLoading(false);
                    return;
                }
            } else if (selectedOption === "all") {
                // 전체 근무자 대상 대타 요청
                console.log("전체 근무자에게 대타 요청:", {
                    fromUserId,
                    scheduleId,
                    requestType: "ALL_USERS",
                    requestDate: currentDate.format("YYYY-MM-DD")
                });
                
                try {
                    // 요청 데이터 구성 - 필수 필드만 포함
                    const requestData: ShiftRequest = {
                        fromUserId: Number(fromUserId),
                        scheduleId: Number(scheduleId),
                        requestType: "ALL_USERS",
                        requestDate: currentDate.format("YYYY-MM-DD")
                    };
                    
                    // 스케줄 ID가 0이 아닌지 확인
                    if (requestData.scheduleId === undefined || requestData.scheduleId === null || isNaN(requestData.scheduleId)) {
                        throw new Error("유효한 스케줄 ID가 필요합니다.");
                    }
                    
                    console.log("대타 요청 데이터:", JSON.stringify(requestData, null, 2));
                    
                    // apiService의 requestShift 함수 사용
                    const response = await requestShift(storeId, requestData);
                    console.log("대타 요청 응답:", response);
                } catch (apiError) {
                    console.error("API 호출 오류:", apiError);
                    
                    // 상세 에러 정보 로깅
                    setError("대타 요청 중 오류가 발생했습니다.");
                    setLoading(false);
                    return;
                }
            } else if (requestDetails) {
                // 근무 수정 요청 (단계 3에서 요청 내용이 있는 경우)
                console.log("근무 수정 요청:", {
                    scheduleId,
                    details: requestDetails
                });
                
                try {
                    const requestData = {
                        scheduleId: Number(scheduleId),
                        details: requestDetails
                    };
                    
                    console.log("최종 요청 데이터:", JSON.stringify(requestData, null, 2));
                    
                    // apiService의 requestModification 함수 사용
                    const response = await requestModification(storeId, requestData);
                    console.log("근무 수정 요청 응답:", response);
                } catch (apiError) {
                    console.error("API 호출 오류:", apiError);
                    
                    // 상세 에러 정보 로깅
                    setError("근무 수정 요청 중 오류가 발생했습니다.");
                    setLoading(false);
                    return;
                }
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
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("요청을 처리하는 중 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 콘솔에 modalData 출력
    useEffect(() => {
        console.log("RequestModal - modalData:", modalData);
        console.log("RequestModal - otherGroupMembers:", otherGroupMembers);
    }, [modalData, otherGroupMembers]);

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
                                        {modalData.map((group: { startTime: string; endTime: string }, index: number) => {
                                            // "HH:mm:ss"에서 시와 분만 추출
                                            const startTimeFormatted =
                                                group.startTime
                                                    ? group.startTime.split(":").slice(0, 2).join(":")
                                                    : "시작 시간 없음";
                                            const endTimeFormatted =
                                                group.endTime
                                                    ? group.endTime.split(":").slice(0, 2).join(":")
                                                    : "종료 시간 없음";

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
                                    names={workerList}
                                    selectedWorkers={selectedWorker}
                                    onSelect={(selected) => {
                                        setSelectedWorker(selected);
                                        // 선택된 ID에 해당하는 이름을 찾아서 설정
                                        const selectedNames = Array.isArray(selected) ? selected.map(id => {
                                            const worker = workerList.find(w => w.id === id);
                                            return worker ? worker.name : id;
                                        }) : [];
                                        setSelectedWorkerNames(selectedNames);
                                    }}
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
                                        {modalData.map((group: { startTime: string; endTime: string }, index: number) => {
                                            // "HH:mm:ss"에서 시와 분만 추출
                                            const startTimeFormatted =
                                                group.startTime
                                                    ? group.startTime.split(":").slice(0, 2).join(":")
                                                    : "시작 시간 없음";
                                            const endTimeFormatted =
                                                group.endTime
                                                    ? group.endTime.split(":").slice(0, 2).join(":")
                                                    : "종료 시간 없음";

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
                                        })}
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
                                        : (selectedWorkerNames.length > 0
                                            ? selectedWorkerNames.join(", ")
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
                                        {modalData.map((group: { startTime: string; endTime: string }, index: number) => {
                                            const startTimeFormatted =
                                                group.startTime
                                                    ? group.startTime.split(":").slice(0, 2).join(":")
                                                    : "시작 시간 없음";
                                            const endTimeFormatted =
                                                group.endTime
                                                    ? group.endTime.split(":").slice(0, 2).join(":")
                                                    : "종료 시간 없음";

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
                                        })}
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
