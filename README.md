# Wound Segementation Prediction Pages

This Repositories is contains code to run to WSP(Wound segementation prediction) web server.
WSP is a wound analysis platform, focusing on **pressure sore** type wounds.

![](https://github.com/Hotshot824/WSP-Pages/blob/main/img/paint_example.png?raw=true)

![](https://github.com/Hotshot824/WSP-Pages/blob/main/img/chart_example.png?raw=true)

## Docker
This docker compose will listen for:
* 80 (web service)
* 8080 (gui for database, phpMyAdmin.)
* 3306 (database service)

If your CPU not support tensorflow 2.6.0, Can using `docker_image/wsp-server-compiler-tensorflow` to build self image.

## Configure
* Web server php config at `web_server/config/php.ini`
* SQL initialization script file at `db_server/init/`  
   * about how to create SQL table, user.

In `php.ini` attributes:  
* `mysqli.default_host`, `mysqli.default_user`, `mysqli.default_pw`  
    default DB config.
* `ptmp.probability`  
    per time useing the predict function, there is a certain chance to clear the temporary file.  
    if value is 100 means has 1/100 chance to clear.
* `ptmp.path`  
    predict temporary file store path.
* `ptmp.tmpfile_lifetime`  
    lifetime for temporary file, the unit is minutes.
* `ptmp.tmpfile_max`  
    maximum number of temporary file store.

## Predict module
The Predict mod pack is outside of this repository. \
Download and then put in the following path.
```
web_server/WSP-Pages/wound
```

## Build from scratch

First install docker with docker-compose environment.
```
sudo apt-get install docker docker-compose
```

1. Clone this repository.
2. Download prediction module. [module link]
3. Unzip the file, and then join prediction mod to `/web_server/WSP-Pages/wound`.
4. Using `chown -R 33:33 ./*` to change owner to `www-data`.
5. Run `docker-compose up`
6. Web service is start.

Tip. You can build docker image in local, in docker_image directory, 
below is a build wsp-server image example:
```
$cd ./docker_images/wsp-server
$sudo docker build –t <imagename> .
```
Remenber change docker-compose file content, change image source.

<br>

## Directiory structure

currently directory will be like:
- mysql: store all database data.
- mysql_image: image storage path.

```
|---db_server---data---|---mysql
|                      |---mysql_image
|---images
|
|---wbe_server
|
|---docker-compose.yml
```

[module link]: https://drive.google.com/file/d/14w-BeoMspX2JWcgqsVWH-CB_ulBCn8Uh/view?usp=sharing