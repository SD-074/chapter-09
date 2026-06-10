import express from 'express'; // Import express
import { connectToDatabase } from '#db';
import { postRoutes } from '#routes';
const app = express(); // Create your app object
const port = 3000; // Declare a port variable
app.use(express.json()); // Middleware to parse JSON bodies
// Application-level middleware
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  req.user = { name: 'John', id: 1, email: 'j@j.com' };
  next();
});
app.use('/posts', postRoutes);
app.listen(port, () => {
  connectToDatabase();
  console.log(`Server is running on port ${port}`);
});
