# Docker gnome shell extension

Docker configuration change to allow localhost to serve list of containers
- DOCKER_OPTS="-H unix:///var/run/docker.sock -H tcp://127.0.0.1:5555"

Test that your configuration works by going to url
- http://127.0.0.1:5555/containers/json
