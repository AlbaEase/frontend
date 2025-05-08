-- 외래키 제약 해제
SET FOREIGN_KEY_CHECKS=0;

-- 스토어 더미 데이터
INSERT IGNORE INTO store (name, location, store_code, require_approval, business_number, created_at) VALUE
    ('맥도날드 강남점', '서울 강남구', 'STORE001', false, '123-45-67890', NOW()),
    ('스타벅스 홍대점', '서울 마포구', 'STORE002', false, '234-56-78901', NOW()),
    ('롯데리아 가좌점', '인천 서구', 'STORE003', false, '222-56-78901', NOW()),
    ('KFC 부평점', '인천 부평구', 'STORE004', false, '222-56-73201', NOW()),
    ('버거킹 구월점', '인천 남동구', 'STORE005', false, '322-56-78901', NOW());

-- 사용자 더미 데이터
INSERT IGNORE INTO user (
    last_name, first_name, email, password,
    role, business_number, created_at, social_type
) VALUES
      ('김', '가윤', 'boss1@albaease.com', '$2a$10$vL7Y7c6oAdqJR5DCLJSgOO0/770kFGAq/vN2rhZAO5rzSZrvYGEou', 'OWNER',  '123-45-67890', NOW(), 'NONE'),
      ('조', '유성', 'boss2@albaease.com', '$2a$10$vL7Y7c6oAdqJR5DCLJSgOO0/770kFGAq/vN2rhZAO5rzSZrvYGEou', 'OWNER',  '234-56-78901', NOW(), 'NONE'),
      ('김', '시현', 'staff1@albaease.com', '$2a$10$vL7Y7c6oAdqJR5DCLJSgOO0/770kFGAq/vN2rhZAO5rzSZrvYGEou', 'WORKER',  NULL, NOW(), 'NONE'),
      ('김', '지희', 'staff2@albaease.com', '$2a$10$vL7Y7c6oAdqJR5DCLJSgOO0/770kFGAq/vN2rhZAO5rzSZrvYGEou', 'WORKER',  NULL, NOW(), 'NONE'),
      ('이', '서영', 'staff3@albaease.com', '$2a$10$vL7Y7c6oAdqJR5DCLJSgOO0/770kFGAq/vN2rhZAO5rzSZrvYGEou', 'WORKER',  NULL, NOW(), 'NONE'),
      ('조', '정현', 'staff4@albaease.com', '$2a$10$vL7Y7c6oAdqJR5DCLJSgOO0/770kFGAq/vN2rhZAO5rzSZrvYGEou', 'WORKER',  NULL, NOW(), 'NONE'),
      ('이', '은우', 'staff5@albaease.com', '$2a$10$vL7Y7c6oAdqJR5DCLJSgOO0/770kFGAq/vN2rhZAO5rzSZrvYGEou', 'WORKER',  NULL, NOW(), 'NONE');

-- 유저-스토어 관계 더미 데이터
INSERT IGNORE INTO user_store_relationship (user_id, store_id, work_start_date) VALUES
(1, 1, NOW()), -- boss1: 맥도날드 강남점
(1, 3, NOW()), -- boss1: 롯데리아 가좌점
(1, 4, NOW()), -- boss1: KFC 부평점
(1, 5, NOW()), -- boss1: 버거킹 구월점
(2, 2, NOW()), -- boss2: 스타벅스 홍대점
(3, 1, NOW()), -- 김시현: 맥도날드 강남점
(4, 1, NOW()), -- 김지희: 맥도날드 강남점
(5, 1, NOW()), -- 이서영: 맥도날드 강남점
(6, 2, NOW()), -- 조정현: 스타벅스 홍대점
(7, 2, NOW()), -- 이은우: 스타벅스 홍대점
(3, 3, NOW()), -- 김시현: 롯데리아 가좌점
(5, 4, NOW()), -- 이서영: KFC 부평점
(6, 5, NOW()); -- 조정현: 버거킹 구월점

-- 맥도날드 강남점 (store_id 1) 스케줄: 관계 있는 유저만
INSERT IGNORE INTO schedule (
    store_id, user_id, work_date, start_time, end_time,
    break_time, repeat_days, repeat_end_date
) SELECT 1, 3, '2024-02-27', '09:00:00', '18:00:00', '12:00:00', 'MON,WED,FRI', '2024-12-31'
WHERE NOT EXISTS (SELECT 1 FROM schedule WHERE store_id = 1 AND user_id = 3 AND work_date = '2024-02-27')
UNION
SELECT 1, 4, '2024-02-27', '10:00:00', '19:00:00', '13:00:00', 'TUE,THU,SAT', '2024-12-31'
WHERE NOT EXISTS (SELECT 1 FROM schedule WHERE store_id = 1 AND user_id = 4 AND work_date = '2024-02-27')
UNION
SELECT 1, 5, '2024-02-27', '11:00:00', '20:00:00', '14:00:00', 'MON,WED,FRI', '2024-12-31'
WHERE NOT EXISTS (SELECT 1 FROM schedule WHERE store_id = 1 AND user_id = 5 AND work_date = '2024-02-27');

-- 스타벅스 홍대점 (store_id 2) 스케줄: 관계 있는 유저만
INSERT IGNORE INTO schedule (
    store_id, user_id, work_date, start_time, end_time,
    break_time, repeat_days, repeat_end_date
) SELECT 2, 6, '2024-02-27', '09:00:00', '18:00:00', '12:00:00', 'TUE,THU,SAT', '2024-12-31'
WHERE NOT EXISTS (SELECT 1 FROM schedule WHERE store_id = 2 AND user_id = 6 AND work_date = '2024-02-27')
UNION
SELECT 2, 7, '2024-02-27', '10:00:00', '19:00:00', '13:00:00', 'MON,WED,FRI', '2024-12-31'
WHERE NOT EXISTS (SELECT 1 FROM schedule WHERE store_id = 2 AND user_id = 7 AND work_date = '2024-02-27');

-- 롯데리아 가좌점 (store_id 3) 스케줄: 관계 있는 유저만
INSERT IGNORE INTO schedule (
    store_id, user_id, work_date, start_time, end_time,
    break_time, repeat_days, repeat_end_date
) SELECT 3, 3, '2024-03-01', '08:00:00', '17:00:00', '12:00:00', 'MON,WED,FRI', '2024-12-31'
WHERE NOT EXISTS (SELECT 1 FROM schedule WHERE store_id = 3 AND user_id = 3 AND work_date = '2024-03-01');

-- KFC 부평점 (store_id 4) 스케줄: 관계 있는 유저만
INSERT IGNORE INTO schedule (
    store_id, user_id, work_date, start_time, end_time,
    break_time, repeat_days, repeat_end_date
) SELECT 4, 5, '2024-03-01', '09:00:00', '18:00:00', '13:00:00', 'MON,TUE,WED', '2024-12-31'
WHERE NOT EXISTS (SELECT 1 FROM schedule WHERE store_id = 4 AND user_id = 5 AND work_date = '2024-03-01');

-- 버거킹 구월점 (store_id 5) 스케줄: 관계 있는 유저만
INSERT IGNORE INTO schedule (
    store_id, user_id, work_date, start_time, end_time,
    break_time, repeat_days, repeat_end_date
) SELECT 5, 6, '2024-03-02', '07:00:00', '16:00:00', '11:00:00', 'MON,WED,FRI', '2024-12-31'
WHERE NOT EXISTS (SELECT 1 FROM schedule WHERE store_id = 5 AND user_id = 6 AND work_date = '2024-03-02');

-- 외래키 제약 다시 설정
SET FOREIGN_KEY_CHECKS=1;
