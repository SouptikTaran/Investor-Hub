import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.route.js';
import cors from 'cors'
import dotenv from 'dotenv';
import cron from 'node-cron';
import  checkEmailForSubject  from './configs/emailFetching.service.js';
import logger from './configs/logger.js';
dotenv.config();


const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
  origin: '*'
}))

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});


app.use('/api', router)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);  // Log the error for debugging
  res.status(500).json({ message: 'Internal server error' });
});

cron.schedule('*/20 * * * * *', async () => {
  try {
    logger.info('Running the email fetching cron job...');
    await checkEmailForSubject(); // Call the email fetching function
  } catch (error) {
    logger.error('Error running cron job:', error);
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
