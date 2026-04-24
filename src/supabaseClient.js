/**
 * Static site data now goes through the Flask API + Postgres (dgmts_static_db).
 * The API surface is implemented in `dbClient.js` to match the old Supabase client.
 */
import def, { createClient, supabase } from './dbClient.js'
export { createClient, supabase }
export default def
