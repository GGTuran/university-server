// const express = require('express')
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { studentRoutes } from './app/modules/student/student.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFoundError from './app/middlewares/notFoundError';
const app: Application = express();
// const port = 3000

//Parsers
app.use(express.json());
app.use(cors());


//applications route

app.use('/api/v1/students', studentRoutes);


//global error handler
app.use(globalErrorHandler);

//not found error
app.use(notFoundError);


app.get('/', (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
});

export default app;
