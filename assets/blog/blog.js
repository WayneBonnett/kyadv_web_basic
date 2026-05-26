// Function to get URL parameters
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Function to load and display blog posts
async function loadBlogPosts() {
  try {
    const response = await fetch("posts.json");
    if (!response.ok) {
      throw new Error("Failed to load blog posts");
    }
    const posts = await response.json();
    const blogGrid = document.getElementById("blog-grid");

    if (!blogGrid) {
      console.error("Blog grid element not found");
      return;
    }

    blogGrid.innerHTML = posts
      .map(
        (post) => `
            <article class="blog-card">
                <div class="blog-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="blog-content">
                    <h3>${post.title}</h3>
                    <div class="blog-meta">
                        <span class="date"><i class="far fa-calendar"></i> ${
                          post.date
                        }</span>
                        <span class="read-time"><i class="far fa-clock"></i> ${
                          post.readTime
                        }</span>
                    </div>
                    <p>${post.excerpt}</p>
                    <div class="blog-tags">
                        ${post.tags
                          .map((tag) => `<span class="tag">${tag}</span>`)
                          .join("")}
                    </div>
                    <a href="post.html?slug=${
                      post.slug
                    }" class="read-more">Read More</a>
                </div>
            </article>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error loading blog posts:", error);
    showError("Failed to load blog posts. Please try again later.");
  }
}

// Function to load and display a single blog post
async function loadBlogPost() {
  const slug = getUrlParameter("slug");
  if (!slug) {
    showError("Post not found");
    return;
  }

  try {
    const response = await fetch("posts.json");
    if (!response.ok) {
      throw new Error("Failed to load blog post");
    }
    const posts = await response.json();
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      showError("Post not found");
      return;
    }

    // Update page title
    document.title = `${post.title} - Kentucky ADV`;

    // Update post content
    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-date").textContent = post.date;
    document.getElementById("post-read-time").textContent = post.readTime;
    document.getElementById("post-image").src = post.image;
    document.getElementById("post-image").alt = post.title;

    // Update tags
    const tagsContainer = document.getElementById("post-tags");
    tagsContainer.innerHTML = post.tags
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");

    // Load post content
    try {
      const contentResponse = await fetch(`posts/${post.slug}.html`);
      if (!contentResponse.ok) {
        throw new Error("Failed to load post content");
      }
      const content = await contentResponse.text();
      document.getElementById("post-content").innerHTML = content;
    } catch (error) {
      console.error("Error loading post content:", error);
      showError("Failed to load post content");
    }
  } catch (error) {
    console.error("Error loading blog post:", error);
    showError("Failed to load blog post");
  }
}

// Function to show error messages
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `
        <p>${message}</p>
        <button onclick="this.parentElement.remove()">×</button>
    `;
  document.body.insertBefore(errorDiv, document.body.firstChild);
}

// Initialize based on current page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("blog-grid")) {
    loadBlogPosts();
  } else if (document.querySelector(".blog-post")) {
    loadBlogPost();
  }
});
