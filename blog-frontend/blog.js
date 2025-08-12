const api = 'https://blog-post-app-bzdb.onrender.com/api/blogs';  // your backend URL

const form = document.getElementById('blogForm');
const blogsContainer = document.getElementById('blogsContainer');
const blogIdInput = document.getElementById('blogId');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const authorInput = document.getElementById('author');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const blog = {
    title: titleInput.value,
    content: contentInput.value,
    author: authorInput.value
  };

  if (blogIdInput.value) {
    await fetch(`${api}/${blogIdInput.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog)
    });
  } else {
    await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog)
    });
  }

  form.reset();
  blogIdInput.value = '';
  loadBlogs();
});

async function loadBlogs() {
  const res = await fetch(api);
  const blogs = await res.json();

  blogsContainer.innerHTML = '';
  blogs.forEach(blog => {
    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${blog.title}</h5>
          <p class="card-text">${blog.content}</p>
          <p><small class="text-muted">By ${blog.author}</small></p>
          <button class="btn btn-sm btn-secondary me-2" onclick="editBlog('${blog._id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteBlog('${blog._id}')">Delete</button>
        </div>
      </div>
    `;
    blogsContainer.appendChild(card);
  });
}

async function editBlog(id) {
  const res = await fetch(`${api}/${id}`);
  const blog = await res.json();
  blogIdInput.value = blog._id;
  titleInput.value = blog.title;
  contentInput.value = blog.content;
  authorInput.value = blog.author;
}

async function deleteBlog(id) {
  await fetch(`${api}/${id}`, { method: 'DELETE' });
  loadBlogs();
}

loadBlogs();
