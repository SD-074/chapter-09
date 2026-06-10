import express from 'express'; // Import express
import { connectToDatabase } from '#db';
import { postRoutes } from '#routes';
import { errorHandler } from '#middleware';
const app = express(); // Create your app object
const port = 3000; // Declare a port variable
app.use(express.json()); // Middleware to parse JSON bodies
// Application-level middleware

app.get('/', (req, res) => {
  throw new Error('Something went wrong', { cause: { status: 418 } });
  res.json({ message: 'Hello, world!' });
});

app.use((req, res, next) => {
  console.log('Time:', Date.now());
  req.user = { name: 'John', id: 1, email: 'j@j.com' };
  next();
});
app.use('/posts', postRoutes);
//THIS NEED TO BE AFTER ALL THE ROUTES
app.use('*splat', (req, res, next) => {
  throw new Error('Not Found', { cause: { status: 404 } });
});
//THE ERROR HANDLER NEED TO BE THE LAST MIDDLEWARE TO BE APPLIED BEFORE app.listen
app.use(errorHandler);
app.listen(port, () => {
  connectToDatabase();
  console.log(`Server is running on port ${port}`);
});
