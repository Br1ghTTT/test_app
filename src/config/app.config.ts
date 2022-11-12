import { registerAs } from '@nestjs/config';

export default registerAs('application', () => ({
   port: Number.parseInt(process.env.PORT, 10),
   salt: Number.parseInt(process.env.SALT, 10),
   nodeEnv: process.env.NODE_ENV,
}));
