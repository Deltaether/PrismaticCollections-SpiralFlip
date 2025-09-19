# Twitter Feedback Python Application Makefile

.PHONY: help install dev-install test lint format type-check clean setup-db migrate reset-db run-user run-batch rate-limit

help:
	@echo "Available commands:"
	@echo "  install      - Install production dependencies"
	@echo "  dev-install  - Install development dependencies"
	@echo "  test         - Run tests"
	@echo "  lint         - Run linting"
	@echo "  format       - Format code"
	@echo "  type-check   - Run type checking"
	@echo "  clean        - Clean up temporary files"
	@echo "  setup-db     - Set up EdgeDB database"
	@echo "  migrate      - Run database migrations"
	@echo "  reset-db     - Reset database (WARNING: destroys all data)"
	@echo "  run-user     - Run single user fetch (requires USERNAME variable)"
	@echo "  run-batch    - Run batch user fetch (requires USERNAMES variable)"
	@echo "  rate-limit   - Check API rate limit status"

install:
	pip install -r requirements.txt

dev-install:
	pip install -r requirements.txt
	pip install -e .

test:
	pytest tests/ -v --cov=src --cov-report=html --cov-report=term

lint:
	flake8 src/ tests/

format:
	black src/ tests/

type-check:
	mypy src/

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + || true
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache/ .coverage htmlcov/ .mypy_cache/ build/ dist/ *.egg-info/

setup-db:
	@echo "Setting up EdgeDB database..."
	edgedb instance create twitter_feedback || true
	edgedb database create twitter_data || true

migrate:
	@echo "Running database migrations..."
	edgedb migrate

reset-db:
	@echo "WARNING: This will destroy all data in the database!"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	edgedb database wipe twitter_data
	edgedb migrate

run-user:
	@if [ -z "$(USERNAME)" ]; then \
		echo "Usage: make run-user USERNAME=<twitter_username> [TWEETS=<number>]"; \
		exit 1; \
	fi
	python src/main.py user $(USERNAME) $(if $(TWEETS),--tweets $(TWEETS))

run-batch:
	@if [ -z "$(USERNAMES)" ]; then \
		echo "Usage: make run-batch USERNAMES='user1 user2 user3' [TWEETS=<number>]"; \
		exit 1; \
	fi
	python src/main.py batch $(USERNAMES) $(if $(TWEETS),--tweets $(TWEETS))

rate-limit:
	python src/main.py rate-limit

# Development shortcuts
dev: dev-install setup-db migrate

check: lint type-check test

# Example usage targets
example-single:
	@echo "Example: Fetching 50 tweets for @elonmusk"
	python src/main.py user elonmusk --tweets 50

example-batch:
	@echo "Example: Fetching 25 tweets each for multiple users"
	python src/main.py batch elonmusk tim_cook sundarpichai --tweets 25