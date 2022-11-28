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

CREATE TABLE predict_result
(
    `patient_id` CHAR(20) NOT NULL,
    `area` FLOAT(8) NOT NULL,
    `date` DATETIME NOT NULL,
    `original_img` CHAR(40) NOT NULL,
    `predcit_img` CHAR(40) NOT NULL,

    FOREIGN KEY(`patient_id`) REFERENCES patient_info(`patient_id`)
);
