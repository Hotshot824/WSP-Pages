-- Create Database WSP;

USE WSP

CREATE TABLE 病患資料
(病號 CHAR(8),
 密碼 CHAR(12),
 PRIMARY KEY(病號)
)

CREATE TABLE 預測結果
(病號 CHAR(8),
 面積 FLOAT(8),
 日期 CHAR(12)
 PRIMARY KEY(病號)
 FOREIGN KEY(病號) REFERENCES 病患資料(病號)
)
