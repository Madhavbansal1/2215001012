
 // Get posts based on type (popular or latest)
const popular = async (req, res) => {
    try {
      const { type } = req.query;
      
      // Fetch all posts
      const postsRes = await axios.get('http://20.244.56.144/evaluation-service/posts', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTU0MzQ4LCJpYXQiOjE3NDQ5NTQwNDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ5MzQ3YmFhLTcwMDktNDIyZS1hY2VlLWI3YmZmZDZhMjhmOSIsInN1YiI6Im1hZGhhdi5iYW5zYWxfY3MyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJtYWRoYXYuYmFuc2FsX2NzMjJAZ2xhLmFjLmluIiwibmFtZSI6Im1hZGhhdiBiYW5zYWwiLCJyb2xsTm8iOiIyMjE1MDAxMDEyIiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiNDkzNDdiYWEtNzAwOS00MjJlLWFjZWUtYjdiZmZkNmEyOGY5IiwiY2xpZW50U2VjcmV0IjoiRFZNc0t6eVphUGVKWnN1SyJ9.Eaj8YWRFewYYXvDUXRDNimSQzrFyFWIHbAg-9Jgj1aY"
        }
      });
      const posts = postsRes.data.posts || [];
  
      if (type === 'popular') {
        // Fetch and count comments for each post
        const postCommentCounts = [];
  
        await Promise.all(
          posts.map(async (post) => {
            try {
              const commentsRes = await axios.get(`http://20.244.56.144/evaluation-service/posts/${post.id}/comments`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTU0MzQ4LCJpYXQiOjE3NDQ5NTQwNDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ5MzQ3YmFhLTcwMDktNDIyZS1hY2VlLWI3YmZmZDZhMjhmOSIsInN1YiI6Im1hZGhhdi5iYW5zYWxfY3MyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJtYWRoYXYuYmFuc2FsX2NzMjJAZ2xhLmFjLmluIiwibmFtZSI6Im1hZGhhdiBiYW5zYWwiLCJyb2xsTm8iOiIyMjE1MDAxMDEyIiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiNDkzNDdiYWEtNzAwOS00MjJlLWFjZWUtYjdiZmZkNmEyOGY5IiwiY2xpZW50U2VjcmV0IjoiRFZNc0t6eVphUGVKWnN1SyJ9.Eaj8YWRFewYYXvDUXRDNimSQzrFyFWIHbAg-9Jgj1aY"
              }});
              postCommentCounts.push({
                postId: post.id,
                commentCount: commentsRes.data.length
              });
            } catch (err) {
              console.error(`Error fetching comments for post ID: ${post.id}`);
            }
          })
        );
  
        // Sort posts by comment count
        const sortedPosts = postCommentCounts
          .sort((a, b) => b.commentCount - a.commentCount)
          .map((item) => posts.find(post => post.id === item.postId));
        
        // Send response with the top posts
        res.json({ posts: sortedPosts });
      }
  
      else if (type === 'latest') {
        // Sort posts by creation date (latest first)
        const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        // Fetch the latest 5 posts
        const latestPosts = sortedPosts.slice(0, 5);
        res.json({ posts: latestPosts });
      }
  
      else {
        // Invalid type query
        res.status(400).json({ message: 'Invalid query parameter. Accepted values: "popular" or "latest".' });
      }
  
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  // Get posts by userId
  const post1 = async (req, res) => {
    try {
      const { userid } = req.params;
      const response = await axios.get(`http://20.244.56.144/evaluation-service/users/${userid}/posts`,{
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Beara eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTU0MzQ4LCJpYXQiOjE3NDQ5NTQwNDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ5MzQ3YmFhLTcwMDktNDIyZS1hY2VlLWI3YmZmZDZhMjhmOSIsInN1YiI6Im1hZGhhdi5iYW5zYWxfY3MyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJtYWRoYXYuYmFuc2FsX2NzMjJAZ2xhLmFjLmluIiwibmFtZSI6Im1hZGhhdiBiYW5zYWwiLCJyb2xsTm8iOiIyMjE1MDAxMDEyIiwiYWNjZXNzQ29kZSI6IkNObmVHVCIsImNsaWVudElEIjoiNDkzNDdiYWEtNzAwOS00MjJlLWFjZWUtYjdiZmZkNmEyOGY5IiwiY2xpZW50U2VjcmV0IjoiRFZNc0t6eVphUGVKWnN1SyJ9.Eaj8YWRFewYYXvDUXRDNimSQzrFyFWIHbAg-9Jgj1aY"
    }});
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts' });
    }
  };

  // Get Top 5 Users with Most Commented Posts
  const top5 = async (req, res) => {
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
  }


  module.exports = {
    popular,
    post1,
    top5
  };

