import Alarm from "../../components/Alarm";
import AlbaAdd from "../../components/AlbaAdd";
import Calendar from "../../components/Calendar";
import Choice from "../../components/Choice";
import PartTime from "../../components/PartTime";
import SelectRadio from "../../components/SelectRadio";
import "./OwnerMainPage.css";

const OwnerMainPage = () => {
  return (
    <>
      <div>주인장 메인페이지를 구현할 예정입니다.</div>
      <PartTime />
      <Calendar />
      <Choice />
      <Alarm />
      <SelectRadio />
      <AlbaAdd />
      <div>여기에 들어가야할 내용 생각해보기.</div>
    </>
  );
};

export default OwnerMainPage;
