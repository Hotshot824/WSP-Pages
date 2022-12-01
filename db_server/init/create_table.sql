USE WSP

CREATE TABLE patient_info
(
    `uid` INT(6) AUTO_INCREMENT NOT NULL,
    `patient_id` CHAR(20) NOT NULL,
    `patient_password` CHAR(64) NOT NULL,
    `salt` CHAR(6),
    `email` VARCHAR(64),
    PRIMARY KEY(`uid`),
    UNIQUE (`patient_id`)
);

CREATE TABLE area_record
(
    `patient_id` CHAR(20) NOT NULL,
    `area` FLOAT(8) NOT NULL,
    `date` DATETIME NOT NULL,
    `original_img` CHAR(80) NOT NULL,
    `predict_img` CHAR(80),
    `iou_img` CHAR(80),
    FOREIGN KEY(`patient_id`) REFERENCES patient_info(`patient_id`)
);
