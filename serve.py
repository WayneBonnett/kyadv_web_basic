import http.server
import socketserver
import os

# Get the directory containing this script
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Change to the website directory
os.chdir(DIRECTORY)

# Set up the server
PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    httpd.serve_forever() 