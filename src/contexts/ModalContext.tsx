import { createContext, useContext, useState, ReactNode } from "react";

// 모달 컨텍스트 생성
interface ModalContextType {
  /* 열 때 어떤 모달창인지 타입 명시 */
  openModal: (
    modal: "alarm" | "albaAdd" | "request" | "edit",
    data?: any
  ) => void;
  closeModal: () => void;
  /* 활성화 된 타입 */
  activeModal: "alarm" | "albaAdd" | "request" | "edit" | null;
  /* 전달된 데이터를 저장할 변수 */
  modalData: any;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [activeModal, setActiveModal] = useState<
    "alarm" | "albaAdd" | "request" | "edit" | null
  >(null);
  const [modalData, setModalData] = useState<any>(null); // 데이터 저장

  const openModal = (
    modal: "alarm" | "albaAdd" | "request" | "edit",
    data?: any
  ) => {
    setActiveModal(modal);
    setModalData(data);
  };
  const closeModal = () => setActiveModal(null);

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, activeModal, modalData }}
    >
      {children}
    </ModalContext.Provider>
  );
};

// useModal 커스텀 훅
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
