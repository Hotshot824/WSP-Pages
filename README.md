# Wound Segementation Prediction Pages

This Repositories is contains code to run to WSP(Wound segementation prediction) web server.
WSP is a wound analysis platform, focusing on pressure sore type wounds.

![](https://github.com/Hotshot824/WSP-Pages/blob/main/img/paint_example.png?raw=true)

# Docker
This docker compose will listen for:
* 80 (web service)
* 8080 (gui for database)
* 3306 (database service)
```
docker-compose up
```

# Predict module
The Predict mod pack is outside of this repository. \
Download and then put in the following path.
```
web_server/WSP-Pages/wound
```