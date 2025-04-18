const express = require('express');

const app = express();
const axios = require('axios');
const cors = require('cors');

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Get Top 5 Users with Most Commented Posts
app.get('/top5', async (req, res) => {
  try {
    // Step 1: Get all users
    const usersRes = await axios.get('http://20.244.56.144/evaluation-service/users' ,{
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Beara eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTU0MzQ4LCJpYXQiOjE3NDQ5NTQwNDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ5MzQ3YmFhLTcwMDktNDIyZS1hY2VlLWI3YmZmZDZhMjhmOSIsInN1YiI6Im1hZGhhdi5iYW5zYWxfY3MyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJtYWRoYXYuYmFuc2FsX2NzMjJAZ2xhLmFjLmluIiwibmFtZSI6Im1hZGhhdiBiYW5zYWwiLCJyb2xsTm8iOiIyMjE1MDAxMDEyIiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiNDkzNDdiYWEtNzAwOS00MjJlLWFjZWUtYjdiZmZkNmEyOGY5IiwiY2xpZW50U2VjcmV0IjoiRFZNc0t6eVphUGVKWnN1SyJ9.Eaj8YWRFewYYXvDUXRDNimSQzrFyFWIHbAg-9Jgj1aY"
    }});
    const users = usersRes.data.users;
    console.log(users);

    const userCommentCounts = [];

    // Step 2: For each user, get their posts and count total comments
    await Promise.all(
      Object.entries(users).map(async ([userId, userName]) => {
        try {
          const postsRes = await axios.get(`http://20.244.56.144/evaluation-service/users/${userId}/posts`,{
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Beara eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTU0MzQ4LCJpYXQiOjE3NDQ5NTQwNDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ5MzQ3YmFhLTcwMDktNDIyZS1hY2VlLWI3YmZmZDZhMjhmOSIsInN1YiI6Im1hZGhhdi5iYW5zYWxfY3MyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJtYWRoYXYuYmFuc2FsX2NzMjJAZ2xhLmFjLmluIiwibmFtZSI6Im1hZGhhdiBiYW5zYWwiLCJyb2xsTm8iOiIyMjE1MDAxMDEyIiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiNDkzNDdiYWEtNzAwOS00MjJlLWFjZWUtYjdiZmZkNmEyOGY5IiwiY2xpZW50U2VjcmV0IjoiRFZNc0t6eVphUGVKWnN1SyJ9.Eaj8YWRFewYYXvDUXRDNimSQzrFyFWIHbAg-9Jgj1aY"
        }});
          const posts = postsRes.data.posts || [];

          let totalComments = 0;

          // Step 3: For each post, get its comments
          await Promise.all(
            posts.map(async (post) => {
              try {
                const commentsRes = await axios.get(`http://20.244.56.144/evaluation-service/posts/${post.id}/comments`,{
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: "Beara eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTU0MzQ4LCJpYXQiOjE3NDQ5NTQwNDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ5MzQ3YmFhLTcwMDktNDIyZS1hY2VlLWI3YmZmZDZhMjhmOSIsInN1YiI6Im1hZGhhdi5iYW5zYWxfY3MyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJtYWRoYXYuYmFuc2FsX2NzMjJAZ2xhLmFjLmluIiwibmFtZSI6Im1hZGhhdiBiYW5zYWwiLCJyb2xsTm8iOiIyMjE1MDAxMDEyIiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiNDkzNDdiYWEtNzAwOS00MjJlLWFjZWUtYjdiZmZkNmEyOGY5IiwiY2xpZW50U2VjcmV0IjoiRFZNc0t6eVphUGVKWnN1SyJ9.Eaj8YWRFewYYXvDUXRDNimSQzrFyFWIHbAg-9Jgj1aY"
                }});
                totalComments += commentsRes.data.length;
              } catch (err) {
                console.error(`Error fetching comments for post ID: ${post.id}`);
              }
            })
          );

          userCommentCounts.push({
            userId,
            userName,
            totalComments
          });
        } catch (err) {
          console.error(`Error fetching posts for user ID: ${userId}`);
        }
      })
    );

    // Step 4: Sort users by comment count
    const topUsers = userCommentCounts
      .sort((a, b) => b.totalComments - a.totalComments)
      .slice(0, 5);

    // Step 5: Send response
    res.json({ topUsers });
    res.json({ users });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});






// default route
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// starting the server
app.listen(8080,()=>{
    console.log("Server is running on port 8080")
})
