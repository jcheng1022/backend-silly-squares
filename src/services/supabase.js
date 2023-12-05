import {createClient} from "@supabase/supabase-js"
import dotenv from 'dotenv'

dotenv.config();
const options = {

    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }

}
export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY
    , options)
