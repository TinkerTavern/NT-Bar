export DOCKER_BUILDKIT=1

build:
	docker build --tag nt-server .

run:
	docker run -p 3000:3000 --name nt-server nt-server

clean:
	docker rmi --force nt-server

