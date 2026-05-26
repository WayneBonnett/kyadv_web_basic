// Initialize map
let map;
let routes = [];
let currentRoute = null;

// Initialize the map when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Leaflet map
  map = L.map("map").setView([37.8393, -84.27], 7); // Center on Kentucky

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Initialize mobile menu
  initializeMobileMenu();

  // Load routes
  loadRoutes();

  // Load blog posts
  loadBlogPosts();
});

// Mobile menu functionality
function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    // Set initial state
    navLinks.style.display = window.innerWidth > 768 ? "flex" : "none";

    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });

    // Update menu visibility on window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        navLinks.classList.remove("active");
        navLinks.style.display = "flex";
      } else {
        navLinks.style.display = "none";
      }
    });
  }
}

// Load routes from JSON file
async function loadRoutes() {
  console.log("Starting to load routes...");
  try {
    const response = await fetch("assets/routes.json");
    console.log("Routes response:", response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Routes data:", data);
    routes = data.routes;
    console.log("Routes array:", routes);
    displayRoutes();
  } catch (error) {
    console.error("Error loading routes:", error);
    showError("Failed to load routes. Please try again later.");
  }
}

// Display routes in the grid
function displayRoutes() {
  const routesGrid = document.querySelector(".routes-grid");
  if (!routesGrid) {
    console.error("Routes grid element not found!");
    return;
  }

  routesGrid.innerHTML = "";

  routes.forEach((route) => {
    const routeCard = document.createElement("div");
    routeCard.className = "route-card";
    routeCard.innerHTML = `
      <h3>${route.name}</h3>
      <p>${route.description}</p>
      <div class="route-actions">
        <button class="view-route" onclick="showRouteOnMap(${route.id})">
          <i class="fas fa-map-marked-alt"></i> View on Map
        </button>
        <a href="${route.gpxFile}" class="download-gpx" download>
          <i class="fas fa-download"></i> Download GPX
        </a>
      </div>
    `;
    routesGrid.appendChild(routeCard);
  });
}

// Load and display a route on the map
async function showRouteOnMap(routeId) {
  try {
    // Find the route
    const route = routes.find((r) => r.id === routeId);
    if (!route) {
      throw new Error("Route not found");
    }

    // Load GPX file
    const response = await fetch(route.gpxFile);
    if (!response.ok) {
      throw new Error(
        `Failed to load GPX file: ${response.status} ${response.statusText}`
      );
    }
    const gpxContent = await response.text();

    // Parse GPX content
    const parser = new DOMParser();
    const gpxDoc = parser.parseFromString(gpxContent, "text/xml");

    // Check for parsing errors
    const parserError = gpxDoc.querySelector("parsererror");
    if (parserError) {
      throw new Error("Invalid GPX file format");
    }

    // Extract coordinates
    const trackPoints = gpxDoc.getElementsByTagName("trkpt");
    if (trackPoints.length === 0) {
      throw new Error("No track points found in GPX file");
    }

    const coordinates = Array.from(trackPoints).map((point) => {
      const lat = point.getAttribute("lat");
      const lon = point.getAttribute("lon");
      if (!lat || !lon) {
        throw new Error("Invalid track point coordinates");
      }
      return [parseFloat(lat), parseFloat(lon)];
    });

    // Draw route on map
    currentRoute = L.polyline(coordinates, {
      color: "#e65100",
      weight: 3,
      opacity: 0.8,
    }).addTo(map);

    // Fit map to show the entire route
    map.fitBounds(currentRoute.getBounds());

    // Show success message
    showSuccess("Route loaded successfully!");
  } catch (error) {
    console.error("Error loading route:", error);
    showError(`Failed to load route: ${error.message}`);
  }
}

// Show error message
function showError(message) {
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.style.position = "fixed";
  errorMessage.style.top = "20px";
  errorMessage.style.left = "50%";
  errorMessage.style.transform = "translateX(-50%)";
  errorMessage.style.zIndex = "1000";
  errorMessage.innerHTML = `
    ${message}
    <button class="close-error" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  document.body.appendChild(errorMessage);
}

// Show success message
function showSuccess(message) {
  const successMessage = document.createElement("div");
  successMessage.className = "success-message";
  successMessage.style.position = "fixed";
  successMessage.style.top = "20px";
  successMessage.style.left = "50%";
  successMessage.style.transform = "translateX(-50%)";
  successMessage.style.zIndex = "1000";
  successMessage.innerHTML = `
    ${message}
    <button class="close-success" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  document.body.appendChild(successMessage);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Download GPX file
async function downloadGPX(gpxFile, routeName, button) {
  try {
    // Disable button and show loading state
    button.disabled = true;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';

    const response = await fetch(gpxFile);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const gpxContent = await response.text();

    // Create a blob from the GPX content
    const blob = new Blob([gpxContent], { type: "application/gpx+xml" });

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${routeName.toLowerCase().replace(/\s+/g, "-")}.gpx`;

    // Append to body, click, and cleanup
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    // Show success state briefly
    button.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
    setTimeout(() => {
      button.innerHTML = originalText;
    }, 2000);
  } catch (error) {
    console.error("Error downloading GPX file:", error);
    // Show error state
    button.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error';
    // Show error message
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.textContent =
      "Failed to download GPX file. Please check if the file exists.";
    button.parentNode.appendChild(errorMessage);

    // Remove error message after 3 seconds
    setTimeout(() => {
      errorMessage.remove();
      button.innerHTML = originalText;
    }, 3000);
  } finally {
    // Re-enable button
    button.disabled = false;
  }
}

// Blog post loading and display
async function loadBlogPosts() {
  try {
    const response = await fetch("assets/blog/posts.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayBlogPosts(data.posts);
  } catch (error) {
    console.error("Error loading blog posts:", error);
    showError("Failed to load blog posts. Please try again later.");
  }
}

// Display blog posts
function displayBlogPosts(posts) {
  const blogGrid = document.getElementById("blogGrid");
  if (!blogGrid) {
    console.error("Blog grid element not found!");
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
                <h2>${post.title}</h2>
                <div class="blog-meta">
                    <span><i class="far fa-calendar"></i> ${formatDate(
                      post.date
                    )}</span>
                    <span><i class="far fa-clock"></i> ${
                      post.readTime
                    } min read</span>
                </div>
                <div class="blog-tags">
                    ${post.tags
                      .map((tag) => `<span class="tag">${tag}</span>`)
                      .join("")}
                </div>
                <p>${post.excerpt}</p>
                <a href="blog/${post.slug}.html" class="read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `
    )
    .join("");
}

// Format date
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

// Initialize blog posts if on blog page
if (window.location.pathname.includes("blog.html")) {
  loadBlogPosts();
}
