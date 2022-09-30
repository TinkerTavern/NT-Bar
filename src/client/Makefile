export DOCKER_BUILDKIT=1

build:
	docker build --tag nt-client .

run:
	docker run -p 5000:5000 nt-client

clean:
	docker rmi --force nt-client

