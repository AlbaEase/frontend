import styles from "./EmployeeMyCh.module.css";

const EmployeeMyCh = () => {
  // 하드코딩해둠
  const changeRequests = [
    {
      workDate: "25.01.15 / 18:00~23:00",
      requester: "김시현",
      substitute: "김지희",
    },
    {
      workDate: "25.01.14 / 18:00~23:00",
      requester: "이서영",
      substitute: "조유성",
    },
    {
      workDate: "25.01.13 / 18:00~23:00",
      requester: "이서영",
      substitute: "조유성",
    },
  ];

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
        {changeRequests.map((item, index) => (
          <div key={index} className={styles.contents}>
            <div className={styles.contentsD}>{item.workDate}</div>
            <div className={styles.contentsR}>{item.requester}</div>
            <div className={styles.contentsA}>{item.substitute}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeMyCh;
