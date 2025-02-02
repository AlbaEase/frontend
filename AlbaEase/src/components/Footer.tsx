import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <div className={styles.background}>
            <div className={styles.footer}>
                SucceSS 10팀<br />
                PM 이서영<br />
                FE 이은우 조정현<br />
                BE 김가윤 김시현 김지희 조유성
            </div>
        </div>
    );
};

export default Footer;
