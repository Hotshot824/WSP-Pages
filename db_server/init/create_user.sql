-- CREATE USER 'wsp_webserver'@'Database' IDENTIFIED BY 'PASSWORD';
-- GRANT ALL PRIVILEGES ON *.* TO 'wsp_webserver'@'Database' WITH GRANT OPTION;
-- FLUSH PRIVILEGES;

CREATE USER 'wsp_webserver'@'%' IDENTIFIED BY 'PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO 'wsp_webserver'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;