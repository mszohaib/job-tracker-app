# JobTracker Project - AI Agent Instructions

## Architecture Overview
- **Backend**: Node.js Express server in `server/` directory
- **Database**: Supabase (PostgreSQL) for data persistence and authentication
- **Frontend**: Placeholder in `client/` (currently empty, planned for future UI)
- **Data Flow**: REST API endpoints → Supabase client → Database tables

## Key Components
- `server/index.js`: Main Express app with API routes
- `server/connections/supabase.js`: Supabase client configuration
- Root `package.json`: Shared dependencies (Supabase, bcrypt, etc.)

## Developer Workflows
- **Start Development Server**: `cd server && npm run dev` (uses nodemon for auto-restart)
- **Database Operations**: Use Supabase client for all CRUD operations
- **Environment Variables**: Load via `dotenv` (currently hardcoded in supabase.js - migrate to .env)

## Code Patterns & Conventions
- **Database Queries**: Always use async/await with Supabase client
  ```javascript
  const { data, error } = await supabase.from('table').select('*');
  if (error) throw error;
  ```
- **Password Handling**: Hash with bcrypt (10 salt rounds)
  ```javascript
  const hashedPassword = await bcrypt.hash(password, 10);
  ```
- **API Responses**: JSON format, include error messages for client handling
- **Middleware**: `express.json()` for parsing request bodies
- **Error Handling**: Try/catch blocks around async operations, log errors to console

## Common Fixes & Patterns
- **Supabase Inserts**: Use `.insert()` method, not array syntax
  ```javascript
  await supabase.from('users').insert({ name, email, password: hashedPassword });
  ```
- **Duplicate Checks**: Query first, then insert if not exists
- **Validation**: Check required fields before processing
- **CORS**: Enable for frontend integration (add `cors` middleware)

## Security Notes
- Move Supabase credentials to environment variables
- Implement JWT token validation for protected routes
- Use HTTPS in production

## File Structure Expectations
- Keep server logic in `server/` directory
- Add frontend code to `client/` when implementing UI
- Use `connections/` for external service configurations