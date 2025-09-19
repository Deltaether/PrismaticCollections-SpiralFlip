# Phantasia - Prismatic Collections

An Angular 20 application featuring an immersive 3D interactive experience with integrated Twitter data display. This project showcases modern web development with Three.js 3D graphics, real-time data integration, and responsive design.

## Architecture

- **Frontend**: Angular 20 with standalone components
- **3D Graphics**: Three.js with custom WebGL shaders
- **Data Source**: Python-based Twitter API v2 fetcher
- **Database**: EdgeDB with unified backend API
- **Backend**: Node.js/Express serving from port 3001

## Twitter Integration

The application displays real-time Twitter data using a modern Python-based fetching system:

- **Data Source**: Official Twitter API v2 with Bearer Token authentication
- **Python Fetcher**: `/twitter-feedback-python/simple_fetcher.py`
- **Features**: Original posts + retweets in chronological order
- **Rate Limiting**: Built-in 1-2 second delays
- **Database**: Single EdgeDB instance (`twitter_scraper`) as source of truth

## Development Setup

### Prerequisites

1. Node.js 18+ and pnpm
2. Python 3.8+ with pip
3. EdgeDB instance (`twitter_scraper`)

### Start Development Servers

1. **Angular Development Server** (port 5005):
   ```bash
   pnpm start
   # or
   ng serve --port 5005
   ```

2. **Backend Data Server** (port 3001):
   ```bash
   cd src/geldb/backend/src
   npm run dev
   # or directly:
   npx tsx real-data-server.ts
   ```

3. **Python Twitter Fetcher** (runs independently):
   ```bash
   cd twitter-feedback-python
   python simple_fetcher.py
   ```

### Access Points

- **Main App**: http://localhost:5005
- **Backend API**: http://localhost:3001/api/twitter
- **Health Check**: http://localhost:3001/health

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Data Flow Architecture

```
Twitter API v2 (Bearer Token)
        ↓
Python Fetcher (simple_fetcher.py)
        ↓
EdgeDB (twitter_scraper instance)
        ↓
Node.js Backend (port 3001)
        ↓
Angular Frontend (port 5005)
```

### Key Components

- **TwitterDataService**: Angular service for data consumption
- **real-data-server.ts**: Unified backend serving Twitter data from EdgeDB
- **simple_fetcher.py**: Python script using official Twitter API v2
- **EdgeDB Schema**: Centralized data storage with Tweet and TwitterUser entities

## Building

To build the project run:

```bash
pnpm run build
# or
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Testing

### Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner:

```bash
pnpm test
# or
ng test
```

### Backend Testing

Test the backend API endpoints:

```bash
# Test tweets endpoint
curl http://localhost:3001/api/twitter/tweets

# Test user endpoint
curl http://localhost:3001/api/twitter/user/prismcollect_

# Test system status
curl http://localhost:3001/api/twitter/scraper/status
```

## Configuration

### Environment Variables

- `twitterDataEnabled`: Controls Twitter data integration (default: true)
- `API_BASE_URL`: Backend API URL (default: http://localhost:3001/api)
- `EDGEDB_INSTANCE`: EdgeDB instance name (default: twitter_scraper)

### Python Fetcher Configuration

Configure the Python fetcher in `twitter-feedback-python/.env`:

```env
TWITTER_BEARER_TOKEN=your_bearer_token_here
EDGEDB_INSTANCE=twitter_scraper
FETCH_DELAY_MIN=1.0
FETCH_DELAY_MAX=2.0
```

## Key Features

- **3D Interactive Experience**: Complex Three.js implementation with WebGL rendering
- **Real-time Twitter Integration**: Live data fetching with official API v2
- **Responsive Design**: Mobile and desktop optimized interfaces
- **Performance Optimized**: Lazy loading, caching, and efficient data handling
- **Modern Architecture**: Standalone Angular components with signal-based reactivity

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 5005 (Angular) and 3001 (backend) are available
2. **EdgeDB connection**: Verify `twitter_scraper` instance is running
3. **Python dependencies**: Install requirements with `pip install -r requirements.txt`
4. **Twitter API**: Ensure valid Bearer Token in Python fetcher configuration

### Logs

- **Backend logs**: `src/geldb/backend/logs/twitter-data.log`
- **Python fetcher logs**: `twitter-feedback-python/logs/`
- **Angular dev console**: Browser Developer Tools

## Additional Resources

- [Angular CLI Overview](https://angular.dev/tools/cli)
- [Three.js Documentation](https://threejs.org/docs/)
- [EdgeDB Documentation](https://www.edgedb.com/docs)
- [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api)

For project-specific documentation, see `CLAUDE.md` for development guidelines and architecture details.
