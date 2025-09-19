# EdgeDB Docker Volume Initialization

This directory contains database backup and initialization files for the Phantasia Collections EdgeDB container.

## Contents:
- `database_dump/` - EdgeDB database dump with all existing tweets and users
- `schema/` - Database schema files (.gel files)
- `restore_database.sh` - Database restore script
- `docker_init.sh` - Container initialization script
- `metadata.json` - Export metadata and statistics

## Usage:
The Docker container will automatically detect and restore this data on first startup.

Generated: 2025-09-19T13:14:39.228507
Tweet count: 3
