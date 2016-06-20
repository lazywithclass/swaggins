PID = .pid

kill:
	@kill `cat $(PID)` || true
	rm $(PID)

start:
	 { node test/fixtures/server.js & echo $$! > $(PID); }

test:
	@make start
	./node_modules/.bin/mocha test
	@make kill

.PHONY: test
