#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_USER" <<-EOSQL
	CREATE DATABASE analytics;
	CREATE DATABASE users;
	CREATE DATABASE chatbot;
	CREATE DATABASE inventory;
	CREATE DATABASE orders;
	CREATE DATABASE products;
	CREATE DATABASE promotion;
	CREATE DATABASE reviews;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "chatbot" <<-EOSQL
	CREATE EXTENSION IF NOT EXISTS vector;
EOSQL
