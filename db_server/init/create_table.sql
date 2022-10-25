USE WSP

CREATE TABLE patient_info
(
    `uid` INT(6) AUTO_INCREMENT NOT NULL,
    `patient_id` CHAR(20) NOT NULL,
    `patient_password` CHAR(12) NOT NULL,
    `salt` CHAR(6),
    PRIMARY KEY(`uid`),
    UNIQUE (`patient_id`)
);

CREATE TABLE predict_result
(
    `patient_id` CHAR(20) NOT NULL,
    `area` FLOAT(8) NOT NULL,
    `date` DATETIME NOT NULL,
    `original_image` CHAR(40) NOT NULL,
    PRIMARY KEY(`patient_id`),
    FOREIGN KEY(`patient_id`) REFERENCES patient_info(`patient_id`)
);