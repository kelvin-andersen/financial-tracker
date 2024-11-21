const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use(cors());

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Path to the JSON file
const blogsFilePath = path.join(__dirname, '..', 'data', 'db.json');

// Helper function to read blogs from file
const readBlogsFromFile = () => {
    try {
        const data = fs.readFileSync(blogsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
        return [];
    }
};

// Helper function to write blogs to file
const writeBlogsToFile = (blogs) => {
    try {
        fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing file:', err);
    }
};

// Route to get all blogs
app.get('/blogs', (req, res) => {
    const blogs = readBlogsFromFile();
    res.json(blogs.blogs);
});

// Route to add a new blog
app.post('/blogs', (req, res) => {
    const blogs = readBlogsFromFile();
    const newBlog = req.body;

    // Assign a new ID
    newBlog.id = (blogs.blogs.length ? blogs.blogs[blogs.blogs.length - 1].id + 1 : 1);
    blogs.blogs.push(newBlog);

    writeBlogsToFile(blogs);
    res.status(201).json(newBlog);
});

app.delete('/blogs/:id', (req, res) => {
    const blogs = readBlogsFromFile();
    const { id } = req.params;

    // Find index of the blog to delete
    const blogIndex = blogs.blogs.findIndex(blog => blog.id === parseInt(id));

    if (blogIndex === -1) {
        // If blog not found, return a 404 error
        return res.status(404).json({ message: 'Blog not found' });
    }

    // Remove the blog from the array
    const deletedBlog = blogs.blogs.splice(blogIndex, 1);

    // Save the updated blogs object
    writeBlogsToFile(blogs);

    // Respond with the deleted blog data
    res.status(200).json(deletedBlog[0]);
});


// Route to get a single blog by ID
app.get('/blogs/:id', (req, res) => {
    const blogs = readBlogsFromFile();
    const blog = blogs.blogs.find(b => b.id === parseInt(req.params.id));
    console.log(blogs.blogs[blogs.blogs.length - 1].id);

    if (blog) {
        res.json(blog);
    } else {
        res.status(404).json({ message: 'Blog not found' });
    }
});