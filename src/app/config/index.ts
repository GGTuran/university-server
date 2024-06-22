import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds:process.env.BCRYPT_SALT_ROUNDS,
  default_password:process.env.DEFAULT_PASS,
  NODE_ENV:process.env.NODE_ENV,
  JWT_ACCESS_SECRET:process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_id:process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in:process.env.JWT_REFRESH_EXPIRES_IN ,
  reset_pass_ui_link:process.env.RESET_PASS_UI_LINK,
  app_pass:process.env.APP_PASS,
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET,
  super_admin_password:process.env.SUPER_ADMIN_PASSWORD,
};
