import dotenv from 'dotenv';

dotenv.config();

export const baseURL = `https://${process.env.TB_URL}/api/v1`;
