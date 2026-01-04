# Furnitura Backend

Backend API for Snowflake furniture catalog integration.

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Snowflake credentials:**
   Edit `.env` file and replace `your_password_here` with your actual Snowflake password.

3. **Initialize Snowflake table:**
   Run the SQL commands in `setup_snowflake.sql` in your Snowflake console to create the table and insert sample data.

4. **Start the server:**
   ```bash
   npm start
   ```

## API Endpoints

- `GET /health` - Health check
- `GET /api/furniture` - Get all furniture items
- `GET /api/furniture/category/:category` - Get furniture by category
- `GET /api/furniture/search?q=query` - Search furniture by name/description

## Environment Variables

See `.env` file for required configuration.
