import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import cors from 'cors'

import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import hookRoutes from './routes/hookRoutes.js'
dotenv.config()
connectDB()
const app = express()



import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
Sentry.init({
  dsn: "https://8037f1a241224aae9760f9922402f3c8@o1406867.ingest.sentry.io/6744338",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());


//  ================= WAF ===============
// import Waf from 'mini-waf/wafbase';
// import wafrules from 'mini-waf/wafrules';

// //Register the middleware of Mini-WAF with standard rules.
// app.use(Waf.WafMiddleware(wafrules.DefaultSettings));
//  =====================================

var corsOptions = {
    origin: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
}

app.use(cors(corsOptions));
  

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())

app.get('/', function rootHandler(req, res){
    res.send('API is running...')
})
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/payment_hook', hookRoutes)

app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID)
})
app.use('/api/payment/momo', paymentRoutes)
// app.use(notFound)
// app.use(errorHandler)



// app.get("/debug-sentry", function mainHandler(req, res) {
//     throw new Error("My first Sentry error!");
//   });
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
// Optional fallthrough error handler
app.use(errorHandler);

// default port: 5000
const PORT = process.env.PORT || 5000

app.listen(5000, console.log(`Server running in ${process.env.NODE_ENV} on PORT ${PORT}`
    .yellow.bold))