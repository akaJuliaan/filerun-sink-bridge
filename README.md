[![CodeFactor](https://www.codefactor.io/repository/github/akajuliaan/filerun-sink-bridge/badge)](https://www.codefactor.io/repository/github/akajuliaan/filerun-sink-bridge)


# FileRun Sink Bridge <a name = "filerun_sink_bridge"></a>

This project aims to create a bridge for the url shorter [Sink](https://sink.cool) and the file manager [FileRun](https://filerun.com/). With this project you can easily short your filerun links with the help of sink.

## Prerequisites

Well I would recommend to use the docker image I provide for you, so you need to install Docker and  preferably also Docker-Compose.


## Installing

### Docker Compose
Just create a `docker-compose.yml` with the following content:


```yml
services:
  api:
    image: ghcr.io/akajuliaan/filerun-sink-bridge
    restart: always
    ports:
      - 3000:3000
    environment:
      - SLUG_LENGTH=5
      - SINK_URL=https://your-short-url.tdl
```

Now change things like the `SINK_URL` to your own data.

### Filerun Config

Please change your `customizables/config.php` to set a `custom_url_shorter` url to where you deployed this container. Please note that the `token` is your "password" you use to login to your sink instance.

```php
<?php
$config['app']['weblinks']['custom_url_shortener'] = 'http://url-to-bridge-instance:3000/short?token=YOUR_SINK_TOKEN&url=###'
```
