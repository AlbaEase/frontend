import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    sub: string; // 사용자 id
    role: string; // 사용자 권한
    fullName: string; // 사용자 이름
}

export const getUserFromToken = (): DecodedToken | null => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        // console.log("디코딩된 토큰", decoded);
        return decoded;
    } catch (e) {
        console.error("토큰 디코딩 실패", e);
        return null;
    }
};
