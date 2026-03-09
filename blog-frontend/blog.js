const api = 'https://blog-post-app-bzdb.onrender.com/api/blogs';

// DOM Elements
const form = document.getElementById('blogForm');
const blogsContainer = document.getElementById('blogsContainer');
const blogIdInput = document.getElementById('blogId');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const authorInput = document.getElementById('author');
const tagsInput = document.getElementById('tags');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const filterAuthor = document.getElementById('filterAuthor');
const blogFormCard = document.getElementById('blogFormCard');
const toggleFormBtn = document.getElementById('toggleFormBtn');
const cancelBtn = document.getElementById('cancelBtn');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const formTitle = document.getElementById('formTitle');
const loadingSpinner = document.getElementById('loadingSpinner');
const emptyState = document.getElementById('emptyState');
const blogCount = document.getElementById('blogCount');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// State
let allBlogs = [];
let deleteBlogId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadBlogs();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  form.addEventListener('submit', handleFormSubmit);
  searchInput.addEventListener('input', filterBlogs);
  sortSelect.addEventListener('change', filterBlogs);
  filterAuthor.addEventListener('change', filterBlogs);
  toggleFormBtn.addEventListener('click', toggleForm);
  cancelBtn.addEventListener('click', cancelForm);
  contentInput.addEventListener('input', updateWordCount);
  confirmDeleteBtn.addEventListener('click', confirmDelete);
}

// Toggle Form
function toggleForm() {
  if (blogFormCard.style.display === 'none') {
    blogFormCard.style.display = 'block';
    blogFormCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    blogFormCard.style.display = 'none';
    resetForm();
  }
}

// Cancel Form
function cancelForm() {
  blogFormCard.style.display = 'none';
  resetForm();
}

// Reset Form
function resetForm() {
  form.reset();
  blogIdInput.value = '';
  submitText.textContent = 'Create Post';
  formTitle.textContent = 'Create New Blog Post';
  updateWordCount();
}

// Update Word Count
function updateWordCount() {
  const content = contentInput.value;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;
  wordCount.textContent = words;
  charCount.textContent = chars;
}

// Handle Form Submit
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const blog = {
    title: titleInput.value.trim(),
    content: contentInput.value.trim(),
    author: authorInput.value.trim(),
    tags: tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
  };

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';

    if (blogIdInput.value) {
      // Update
      const res = await fetch(`${api}/${blogIdInput.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog)
      });
      
      if (!res.ok) throw new Error('Failed to update blog');
      showToast('Blog updated successfully!', 'success');
    } else {
      // Create
      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog)
      });
      
      if (!res.ok) throw new Error('Failed to create blog');
      showToast('Blog created successfully!', 'success');
    }

    resetForm();
    blogFormCard.style.display = 'none';
    await loadBlogs();
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
    console.error('Error:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> <span id="submitText">' + 
      (blogIdInput.value ? 'Update Post' : 'Create Post') + '</span>';
  }
}

// Load Blogs
async function loadBlogs() {
  try {
    showLoading(true);
    const res = await fetch(api);
    if (!res.ok) throw new Error('Failed to load blogs');
    
    allBlogs = await res.json();
    populateAuthorFilter();
    filterBlogs();
  } catch (error) {
    showToast('Error loading blogs: ' + error.message, 'error');
    console.error('Error:', error);
  } finally {
    showLoading(false);
  }
}

// Populate Author Filter
function populateAuthorFilter() {
  const authors = [...new Set(allBlogs.map(blog => blog.author))].sort();
  filterAuthor.innerHTML = '<option value="">All Authors</option>';
  authors.forEach(author => {
    const option = document.createElement('option');
    option.value = author;
    option.textContent = author;
    filterAuthor.appendChild(option);
  });
}

// Filter and Sort Blogs
function filterBlogs() {
  let filtered = [...allBlogs];

  // Search filter
  const searchTerm = searchInput.value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(blog => 
      blog.title.toLowerCase().includes(searchTerm) ||
      blog.content.toLowerCase().includes(searchTerm) ||
      blog.author.toLowerCase().includes(searchTerm) ||
      (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  }

  // Author filter
  const selectedAuthor = filterAuthor.value;
  if (selectedAuthor) {
    filtered = filtered.filter(blog => blog.author === selectedAuthor);
  }

  // Sort
  const sortValue = sortSelect.value;
  switch (sortValue) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));
      break;
    case 'oldest':
      filtered.sort((a, b) => new Date(a.createdAt || a._id) - new Date(b.createdAt || b._id));
      break;
    case 'title':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'author':
      filtered.sort((a, b) => a.author.localeCompare(b.author));
      break;
  }

  displayBlogs(filtered);
  updateBlogCount(filtered.length);
}

// Display Blogs
function displayBlogs(blogs) {
  blogsContainer.innerHTML = '';

  if (blogs.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  blogs.forEach((blog, index) => {
    const card = document.createElement('div');
    card.className = 'col blog-card-enter';
    card.style.animationDelay = `${index * 0.1}s`;

    const readingTime = calculateReadingTime(blog.content);
    const formattedDate = formatDate(blog.createdAt);
    const tags = blog.tags && blog.tags.length > 0 ? blog.tags : [];

    card.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${escapeHtml(blog.title)}</h5>
          <p class="card-text">${escapeHtml(blog.content)}</p>
          ${tags.length > 0 ? `
            <div class="blog-tags">
              ${tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        <div class="card-footer">
          <div class="blog-meta">
            <div><i class="bi bi-person"></i> ${escapeHtml(blog.author)}</div>
            <div><i class="bi bi-calendar"></i> ${formattedDate}</div>
            <div class="reading-time"><i class="bi bi-clock"></i> ${readingTime} min read</div>
          </div>
          <div class="btn-group">
            <button class="btn btn-sm btn-secondary" onclick="editBlog('${blog._id}')" title="Edit">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="showDeleteModal('${blog._id}')" title="Delete">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    blogsContainer.appendChild(card);
  });
}

// Edit Blog
async function editBlog(id) {
  try {
    const res = await fetch(`${api}/${id}`);
    if (!res.ok) throw new Error('Failed to load blog');
    
    const blog = await res.json();
    blogIdInput.value = blog._id;
    titleInput.value = blog.title;
    contentInput.value = blog.content;
    authorInput.value = blog.author;
    tagsInput.value = blog.tags ? blog.tags.join(', ') : '';
    
    submitText.textContent = 'Update Post';
    formTitle.textContent = 'Edit Blog Post';
    blogFormCard.style.display = 'block';
    blogFormCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    updateWordCount();
  } catch (error) {
    showToast('Error loading blog: ' + error.message, 'error');
    console.error('Error:', error);
  }
}

// Show Delete Modal
function showDeleteModal(id) {
  deleteBlogId = id;
  deleteModal.show();
}

// Confirm Delete
async function confirmDelete() {
  if (!deleteBlogId) return;

  try {
    const res = await fetch(`${api}/${deleteBlogId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete blog');
    
    showToast('Blog deleted successfully!', 'success');
    deleteModal.hide();
    deleteBlogId = null;
    await loadBlogs();
  } catch (error) {
    showToast('Error deleting blog: ' + error.message, 'error');
    console.error('Error:', error);
  }
}

// Calculate Reading Time
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes || 1;
}

// Format Date
function formatDate(dateString) {
  if (!dateString) return 'Unknown date';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show Loading
function showLoading(show) {
  loadingSpinner.style.display = show ? 'block' : 'none';
}

// Update Blog Count
function updateBlogCount(count) {
  blogCount.textContent = `${count} blog${count !== 1 ? 's' : ''}`;
}

// Show Toast Notification
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  const toastId = 'toast-' + Date.now();
  
  const bgColor = type === 'success' ? 'bg-success' : 
                  type === 'error' ? 'bg-danger' : 'bg-primary';
  
  const icon = type === 'success' ? 'bi-check-circle' : 
               type === 'error' ? 'bi-exclamation-circle' : 
               'bi-info-circle';
  
  const toast = document.createElement('div');
  toast.id = toastId;
  toast.className = 'toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  toast.innerHTML = `
    <div class="toast-header ${bgColor} text-white">
      <i class="bi ${icon} me-2"></i>
      <strong class="me-auto">${type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}</strong>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">
      ${escapeHtml(message)}
    </div>
  `;
  
  toastContainer.appendChild(toast);
  const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
  bsToast.show();
  
  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  });
}
