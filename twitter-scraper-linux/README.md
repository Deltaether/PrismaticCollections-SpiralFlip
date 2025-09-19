# Twitter Scraper Linux Application

A Python-based Twitter scraper application using Playwright that replaces the Angular-based implementation. This application scrapes tweets from @prismcollect_ account daily at Japan morning time.

## 🚀 Features

- **Playwright Browser Automation** - Anti-detection measures and persistent browser data
- **EdgeDB Database Storage** - Comprehensive tweet and user data storage
- **Mock Database Support** - For testing without EdgeDB setup
- **Daily Scheduling** - Automated scraping at Japan morning time (09:00 JST)
- **Manual Triggering** - Run scraping sessions on demand
- **Rich Logging** - Beautiful console output and file logging
- **Complete Data Capture** - Tweets, user profiles, engagement metrics, media, hashtags

## 📦 Installation

1. **Clone and Navigate**:
   ```bash
   cd twitter-scraper-linux
   ```

2. **Install Dependencies**:
   ```bash
   # Dependencies are already installed in the virtual environment
   source venv/bin/activate
   ```

3. **Install Playwright Browsers** (if needed):
   ```bash
   playwright install chromium
   ```

## 🔧 Configuration

Edit `.env` file to configure settings:

```env
# Twitter Configuration
TWITTER_USERNAME=prismcollect_
TWITTER_BASE_URL=https://x.com

# Browser Configuration
BROWSER_HEADLESS=true
BROWSER_USER_DATA_DIR=./browser-data
BROWSER_TIMEOUT=30000

# Scheduling
TIMEZONE=Asia/Tokyo
DAILY_SCRAPE_TIME=09:00

# Database
USE_MOCK_DB=true
EDGEDB_DSN=edgedb://localhost:5656/twitter_scraper

# Logging
LOG_LEVEL=INFO
```

## 🎯 Usage

### Quick Commands

```bash
# Run scraping once immediately
./scripts/run_scraper.sh

# Check current status
./scripts/check_status.sh

# Start daily scheduler
./scripts/start_scheduler.sh
```

### Python Module Commands

```bash
source venv/bin/activate

# Run once
python3 -m src.scheduler run

# Check status
python3 -m src.scheduler status

# Start scheduler
python3 -m src.scheduler schedule
```

### Manual Trigger

Create a file named `trigger_scrape.txt` in the project root to manually trigger scraping when the scheduler is running.

## 📊 Current Status Example

```
📊 Current Scraping Status:
   Running: False
   Total tweets: 5
   Consecutive failures: 0
   User: @prismcollect_ (Prismatic Collections)
   Followers: 1250
   Verified: False
```

## 🗃️ Project Structure

```
twitter-scraper-linux/
├── src/
│   ├── models/
│   │   └── tweet_models.py          # Pydantic data models
│   ├── services/
│   │   ├── twitter_scraper.py       # Main scraper service
│   │   ├── database_service.py      # EdgeDB operations
│   │   └── mock_database_service.py # Mock database for testing
│   ├── utils/
│   │   └── logger.py               # Rich logging setup
│   ├── main_scraper.py             # Main scraping logic
│   └── scheduler.py                # Daily scheduler
├── scripts/
│   ├── run_scraper.sh              # Run once script
│   ├── start_scheduler.sh          # Start scheduler
│   └── check_status.sh             # Status check
├── dbschema/
│   └── default.esdl               # EdgeDB schema
├── logs/                          # Log files
├── browser-data/                  # Persistent browser data
├── venv/                          # Python virtual environment
├── .env                          # Configuration
└── requirements.txt              # Python dependencies
```

## 🐦 Data Models

### Tweet Model
- Complete tweet metadata (ID, text, author info)
- Engagement metrics (likes, retweets, replies, quotes)
- Media URLs and types
- Hashtags and mentions
- Retweet/quote information

### User Model
- Profile information (username, display name, bio)
- Follower/following counts
- Verification status
- Profile image URL

### Session Model
- Scraping session tracking
- Success/failure metrics
- Error logging

## 🔄 Scheduling

The scheduler runs continuously and:
- Executes daily scraping at 09:00 JST
- Monitors for manual trigger files
- Handles graceful shutdown (Ctrl+C)
- Logs all operations

## 🎭 Anti-Detection Features

- Persistent browser context with user data
- Human-like scrolling patterns
- Random delays between actions
- Browser automation detection avoidance
- Realistic user agent and headers

## 🗄️ Database Support

### Mock Database (Default)
- In-memory storage for testing
- Pre-loaded with sample tweets
- No external dependencies

### EdgeDB (Production)
- Persistent storage
- Complex queries and relationships
- Set `USE_MOCK_DB=false` in `.env`

## 📝 Logging

- **Console**: Rich formatted output with colors
- **Files**: Daily log files in `logs/` directory
- **Levels**: DEBUG, INFO, WARNING, ERROR

## 🚨 Error Handling

- Automatic retries on failures
- Session tracking with error logging
- Graceful degradation on browser issues
- Network timeout handling

## 🔧 Troubleshooting

1. **Browser Issues**:
   ```bash
   playwright install chromium
   ```

2. **Import Errors**:
   ```bash
   source venv/bin/activate
   export PYTHONPATH="${PYTHONPATH}:."
   ```

3. **Database Connection**:
   - Use mock database: `USE_MOCK_DB=true`
   - Check EdgeDB setup if using EdgeDB

4. **Permissions**:
   ```bash
   chmod +x scripts/*.sh
   ```

## 📈 Monitoring

Check scraper status anytime:
```bash
./scripts/check_status.sh
```

View logs:
```bash
tail -f logs/scraper_$(date +%Y%m%d).log
```

## 🎯 Migration from Angular

This Python application replaces the previous Angular-based scraper with:
- ✅ Native Linux execution (no web server needed)
- ✅ Better resource management
- ✅ Improved anti-detection
- ✅ Simpler deployment
- ✅ Enhanced logging and monitoring
- ✅ Direct EdgeDB integration

The same EdgeDB schema and data models are maintained for compatibility.

## 🔒 Security

- Browser data isolated in `browser-data/` directory
- Environment variables for sensitive configuration
- No hardcoded credentials
- Session persistence for reduced login frequency

---

**Previous Implementation**: Angular/TypeScript web application
**Current Implementation**: Python Linux application with Playwright
**Target**: @prismcollect_ Twitter account
**Schedule**: Daily at 09:00 Japan Standard Time