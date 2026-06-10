import express from 'express'; // Import express

const app = express(); // Create your app object
const port = 3000; // Declare a port variable
app.use(express.json()); // Middleware to parse JSON bodies
const posts = [
  { id: 1, title: 'Post 1' },
  { id: 2, title: 'Post 2' },
  { id: 3, title: 'Post 3' },
]; // Simple array to represent data

app.get('/posts', (req, res) => res.json(posts));
app.get('/posts/:id', (req, res) => {
  const post = posts.find((post) => post.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: 'Post not found' });
  return res.json(post);
});
app.post('/posts', (req, res) => {
  console.log(req.body);
  const newPost = { ...req.body, id: posts.length + 1 };
  posts.push(newPost);
  return res.status(201).json(newPost);
});
app.put('/posts/:id', (req, res) => {
  const postIndex = posts.findIndex((post) => post.id === parseInt(req.params.id));
  if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });
  // merge existing post with incoming fields but preserve the id
  const updatedPost = { ...posts[postIndex], ...req.body, id: posts[postIndex].id };
  posts[postIndex] = updatedPost;
  return res.json(updatedPost);
});
app.delete('/posts/:id', (req, res) => {
  const postIndex = posts.findIndex((post) => post.id === parseInt(req.params.id));
  if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });
  posts.splice(postIndex, 1);
  return res.json({ message: 'Post deleted' });
});
app.listen(port, () => console.log(`Server is running on port ${port}`)); // Spin up server on port 3000
