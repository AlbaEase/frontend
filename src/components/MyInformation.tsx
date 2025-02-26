import styles from "./MyInformation.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

const MyInformation = () => {
    const [userInfo, setUserInfo] = useState({
        name: "",
        phone: "",
        password: "********",
        job: "",
        place: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token"); // 로그인 시 저장된 토큰 가져오기

            if (!token) {
                setError("로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    "http://3.39.237.218:8080/user/mypage",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setUserInfo({
                    name: response.data.name,
                    phone: response.data.phone,
                    password: "********", // 백엔드에서 받아와도 노출 X
                    job: response.data.job || "사장님",
                    place: response.data.place || "등록된 매장 없음",
                });

                setLoading(false);
            } catch (err) {
                setError("사용자 정보를 불러오는 데 실패했습니다.");
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.MyInformation}>
            <div
                className={styles.contentContainer}
                style={{ borderBottom: "1px black solid" }}>
                <div className={styles.title}>나의 정보</div>
                <div className={styles.content}>정보수정하기</div>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.title}>이름</div>
                <div className={styles.content}>{userInfo.name}</div>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.title}>휴대폰 번호</div>
                <div className={styles.content}>{userInfo.phone}</div>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.title}>비밀번호</div>
                <div className={styles.content}>{userInfo.password}</div>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.title}>직업</div>
                <div className={styles.content}>{userInfo.job}</div>
            </div>
            <div className={styles.contentContainer}>
                <div className={styles.title}>근무 매장</div>
                <div className={styles.contentPlace}>{userInfo.place}</div>
            </div>
        </div>
    );
};

export default MyInformation;
