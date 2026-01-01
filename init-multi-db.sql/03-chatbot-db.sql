-- Create chatbot database
CREATE DATABASE chatbot_db;

-- Connect to chatbot_db and enable pgvector extension
\c chatbot_db;
CREATE EXTENSION IF NOT EXISTS vector;
