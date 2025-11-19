import express from 'express';
import payload from 'payload';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.listen(process.env.PORT || 3000, async () => {
    payload.logger.info(
      `Server listening on port ${process.env.PORT || 3000}`
    );
  });
};

start();
