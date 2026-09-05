#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_USER" <<-EOSQL
	CREATE DATABASE orders;
	CREATE DATABASE inventory;
	CREATE DATABASE analytics;
EOSQL
