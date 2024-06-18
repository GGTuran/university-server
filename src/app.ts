// const express = require('express')
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { studentRoutes } from './app/modules/student/student.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFoundError from './app/middlewares/notFoundError';
import { UserRoutes } from './app/modules/user/user.route';
import router from './app/routes';
import  cookieParser from 'cookie-parser';


const app: Application = express();
// const port = 3000

//Parsers
app.use(express.json());
app.use(cors({origin:['http://localhost:5173']}));
app.use(cookieParser());


//applications route

// app.use('/api/v1/students', studentRoutes);
// app.use('/api/v1/users', UserRoutes);
app.use('/api/v1',router)


app.get('/', (req: Request, res: Response) => {
  // const a = 10;
  res.send('University Server');
});

//global error handler
app.use(globalErrorHandler);

//not found error
app.use(notFoundError);

export default app;
