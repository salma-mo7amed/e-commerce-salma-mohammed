// import modules:
import path from 'path'
import dotenv from 'dotenv'
import express from "express";
import { bootstrap } from "./src/bootstrap.js";
import { cronedJob } from './src/utils/cron-job.js';
// create app:
const app = express();
cronedJob()
dotenv.config({ path: path.resolve("./config/.env") });
bootstrap(app, express);




