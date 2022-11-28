# Wound Segementation Prediction Pages

This Repositories is contains code to run to WSP(Wound segementation prediction) web server.
WSP is a wound analysis platform, focusing on **pressure sore** type wounds.

![](https://github.com/Hotshot824/WSP-Pages/blob/main/img/paint_example.png?raw=true)

# Docker
This docker compose will listen for:
* 80 (web service)
* 8080 (gui for database, phpMyAdmin.)
* 3306 (database service)

### Configure
* Web server php config at `web_server/config/php.ini`
* Sql initialization script file at `db_server/init/`

&nbsp;

* `php.ini`
* `ptmp.probability`  
    per time useing the predict function, there is a certain chance to clear the temporary file.  
    if value is 100 means has 1/100 chance to clear.
* `ptmp.path`  
    predict temporary file store path.
* `ptmp.tmpfile_lifetime`  
    lifetime for temporary file, the unit is minutes.
* `ptmp.tmpfile_max`  
    maximum number of temporary file store.

# Predict module
The Predict mod pack is outside of this repository. \
Download and then put in the following path.
```
web_server/WSP-Pages/wound
```

# Build from scratch

1. Clone repository, and install docker.
2. Download prediction module.
3. Unzip the file, and then join prediction mod to `/web_server/WSP-Pages/wound`.
4. run `docker-compose up`
5. web service is start.

<br>

## directiory structure

currently directory will be like:
- mysql: store all database data.
- mysql_image: image storage path.

```
|---db_server---data---|---mysql
|                      |---mysql_image
|---img
|
|---wbe_server
|
|---docker-compose.yml
```
