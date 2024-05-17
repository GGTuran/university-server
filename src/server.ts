import app from './app';
import config from './app/config';

import mongoose from 'mongoose';

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    app.listen(config.port, () => {
      console.log(`The port should run in port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
console.log(config.port, config.database_url)