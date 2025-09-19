# Twitter Feedback Python Application

A comprehensive Python application for fetching Twitter data using the official Twitter API v2. This application provides a complete solution for collecting, storing, and managing Twitter user information and tweets using Gel as the database backend.

## Features

- **Twitter API v2 Integration**: Full support for official Twitter API v2 endpoints
- **Gel Storage**: Permanent data storage to avoid wasting API calls
- **Rate Limiting**: Intelligent rate limit handling and respect
- **Comprehensive Data Model**: Stores users, tweets, media, URLs, hashtags, and mentions
- **Batch Processing**: Fetch data for multiple users efficiently
- **Error Handling**: Robust error handling and logging
- **Configuration Management**: Flexible configuration system
- **CLI Interface**: Easy-to-use command-line interface

## Twitter API v2 Endpoints Supported

This application follows the official Twitter API v2 documentation:

1. **User Lookup**: [Get users by usernames](https://docs.x.com/x-api/users/get-users-by-usernames)
2. **User Posts**: [Get user posts](https://docs.x.com/x-api/users/get-posts)
3. **Explore Posts**: [Explore a user's posts](https://docs.x.com/tutorials/explore-a-users-posts)

## Installation

### Prerequisites

- Python 3.8 or higher
- Gel 6.0 or higher
- Twitter API v2 Bearer Token

### Setup

1. **Clone or extract the application**:
   ```bash
   cd /path/to/twitter-feedback-python
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Gel**:
   ```bash
   gel instance create twitter_feedback_python
   gel database create gel
   gel migrate
   ```

4. **Configure authentication**:
   - Place your Twitter Bearer Token in `../Twitter-bearer-token` (relative to project root)
   - Or set the `TWITTER_BEARER_TOKEN` environment variable

## Usage

### Command Line Interface

The application provides several commands for different operations:

#### Fetch Single User Data

```bash
python src/main.py user <username> [--tweets N] [--force]
```

Example:
```bash
python src/main.py user elonmusk --tweets 50
```

#### Batch Fetch Multiple Users

```bash
python src/main.py batch <username1> <username2> ... [--tweets N] [--force]
```

Example:
```bash
python src/main.py batch elonmusk tim_cook sundarpichai --tweets 25
```

#### Check Rate Limit Status

```bash
python src/main.py rate-limit
```

### Command Options

- `--tweets N`: Maximum number of tweets to fetch per user (default: 100)
- `--force`: Force refresh data even if it exists in the database
- `--config PATH`: Use custom configuration file

### Configuration

The application supports multiple configuration methods:

#### 1. Environment Variables

```bash
export TWITTER_BEARER_TOKEN="your_bearer_token_here"
export DATABASE_DSN="gel://localhost/gel"
export LOG_LEVEL="INFO"
```

#### 2. Configuration File

Create a JSON configuration file:

```json
{
  "log_level": "INFO",
  "log_dir": "logs",
  "api_retry_attempts": 3,
  "api_timeout": 30,
  "default_max_tweets": 100,
  "respect_rate_limits": true
}
```

Use with: `python src/main.py --config config/my_config.json user <username>`

#### 3. Bearer Token File

Place your Twitter Bearer Token in a file named `Twitter-bearer-token` in the parent directory of this project.

## Database Schema

The application uses Gel with a comprehensive schema that includes:

### Core Types

- **TwitterUser**: User information (username, metrics, verification, etc.)
- **Tweet**: Tweet content and metadata
- **TweetMedia**: Media attachments (photos, videos, GIFs)
- **TweetUrl**: URL entities in tweets
- **TweetHashtag**: Hashtag entities
- **TweetMention**: User mention entities

### Tracking Types

- **ApiRateLimit**: Rate limit monitoring
- **FetchLog**: Operation logging and debugging

### Key Features

- **Automatic deduplication**: Users and tweets are stored only once
- **Relationship tracking**: Full relationships between users and tweets
- **Comprehensive metadata**: All available Twitter API fields
- **Audit trail**: Complete logging of all fetch operations

## Architecture

### Project Structure

```
twitter-feedback-python/
├── src/
│   ├── twitter_client/     # Twitter API v2 client
│   │   ├── __init__.py
│   │   ├── client.py       # Main API client
│   │   └── exceptions.py   # Custom exceptions
│   ├── database/           # Gel integration
│   │   ├── __init__.py
│   │   ├── service.py      # Database service
│   │   └── models.py       # Data models
│   ├── config/             # Configuration management
│   │   ├── __init__.py
│   │   └── settings.py     # Settings class
│   └── main.py             # Main application
├── dbschema/
│   ├── default.esdl        # Gel schema
│   └── migrations/         # Database migrations
├── config/
│   └── default.json        # Default configuration
├── requirements.txt        # Python dependencies
├── setup.py               # Package setup
└── README.md              # This file
```

### Key Components

1. **TwitterAPIClient**: Handles all Twitter API v2 interactions
2. **DatabaseService**: Manages Gel operations and data storage
3. **Settings**: Configuration management with multiple sources
4. **Main Application**: CLI interface and orchestration

## Error Handling

The application includes comprehensive error handling:

- **Rate Limiting**: Automatic detection and waiting for rate limit resets
- **API Errors**: Proper handling of 401, 404, 429, and other HTTP errors
- **Database Errors**: Transaction rollback and error logging
- **Network Issues**: Retry mechanisms and timeout handling

## Logging

Comprehensive logging system:

- **Console Output**: Real-time operation status
- **File Logging**: Detailed logs saved to `logs/twitter_feedback.log`
- **Operation Tracking**: All API calls and database operations logged
- **Error Details**: Full error traces and context

## Rate Limiting

The application respects Twitter's rate limits:

- **Automatic Detection**: Reads rate limit headers from API responses
- **Smart Waiting**: Waits for rate limit resets when necessary
- **Buffer Management**: Keeps requests in reserve to avoid hitting limits
- **Endpoint-Specific**: Tracks limits separately for different endpoints

## Data Privacy and Storage

- **Permanent Storage**: All fetched data is stored to avoid re-fetching
- **Efficient Queries**: Database optimized for common access patterns
- **Audit Trail**: Complete record of all operations and API usage
- **Data Integrity**: Proper constraints and relationships in database

## API Compliance

This application strictly follows Twitter API v2 guidelines:

- **Official Endpoints**: Uses only documented API v2 endpoints
- **Proper Authentication**: Bearer Token authentication as specified
- **Rate Limit Compliance**: Respects all rate limiting requirements
- **Data Usage**: Appropriate use of fetched data according to Twitter policies

## Development

### Running Tests

```bash
pytest tests/ -v
```

### Code Formatting

```bash
black src/
```

### Type Checking

```bash
mypy src/
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Verify your Bearer Token is correct and has proper permissions
   - Check that the token file path is correct

2. **Database Connection Issues**:
   - Ensure Gel is running: `gel instance status`
   - Verify database exists: `gel database list`
   - Run migrations: `gel migrate`

3. **Rate Limiting**:
   - The application will automatically wait for rate limits
   - Use `--force` sparingly to avoid unnecessary API calls

4. **Network Issues**:
   - Check internet connectivity
   - Verify no firewall blocking API access
   - Consider proxy settings if needed

### Debug Logging

Enable debug logging for detailed troubleshooting:

```bash
LOG_LEVEL=DEBUG python src/main.py user <username>
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the logs for error details
3. Open an issue on the project repository

## Changelog

### Version 1.0.0

- Initial release
- Full Twitter API v2 integration
- Gel database backend
- CLI interface
- Comprehensive error handling and logging
- Rate limiting support
- Batch processing capabilities