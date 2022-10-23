Create Database WSP;

USE WSP

CREATE TABLE patient_info
(
    `uid` INT(6) AUTO_INCREMENT NOT NULL,
    `patient_id` CHAR(20) NOT NULL,
    `patient_password` CHAR(12) NOT NULL,
    PRIMARY KEY(`uid`)
)

-- CREATE TABLE 預測結果
-- (病號 CHAR(8),
--  面積 FLOAT(8),
--  日期 CHAR(12)
--  PRIMARY KEY(病號)
--  FOREIGN KEY(病號) REFERENCES 病患資料(病號)
-- )
