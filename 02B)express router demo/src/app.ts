import express from 'express'; // Import express
import { connectToDatabase } from '#db';
import { postRoutes } from '#routes';
const app = express(); // Create your app object
const port = 3000; // Declare a port variable
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/posts', postRoutes);
app.listen(port, () => {
  connectToDatabase();
  console.log(`Server is running on port ${port}`);
}); // Spin up server on port 3000
