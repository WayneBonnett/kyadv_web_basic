# Kentucky ADV - Adventure Routes Website

A modern, responsive website for exploring adventure motorcycle routes in Kentucky. This project provides an interactive platform for motorcycle enthusiasts to discover, view, and download GPX routes across Kentucky's scenic backroads and trails.

## 🌟 Features

- **Interactive Route Map**: View adventure routes on an interactive map
- **GPX Route Downloads**: Download GPX files for use with GPS devices
- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI**: Clean, adventure-themed design with smooth animations
- **Mobile-Friendly**: Optimized for mobile devices with a responsive navigation menu
- **Route Cards**: Easy-to-read route information with quick access to map view and downloads

## 🛠️ Technologies Used

- HTML5
- CSS3 (with CSS Variables and Flexbox/Grid)
- JavaScript (Vanilla)
- Leaflet.js for map integration
- GPX Parser for route handling
- Font Awesome for icons

## 📁 Project Structure

```
kyadvweb-basichtml/
├── assets/
│   ├── images/
│   │   └── hero-bg.jpg
│   ├── gpx/
│   │   └── ClimaxKY_Gravel.gpx
│   └── routes.json
├── index.html
├── styles.css
├── script.js
└── README.md
```

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone [repository-url]
   ```

2. Navigate to the project directory:

   ```bash
   cd kyadvweb-basichtml
   ```

3. Open `index.html` in your web browser or use a local server:

   ```bash
   # Using Python's built-in server
   python -m http.server 8000
   ```

4. Visit `http://localhost:8000` in your browser

## 🗺️ Route Data Structure

Routes are stored in `assets/routes.json` with the following structure:

```json
{
  "routes": [
    {
      "id": 1,
      "name": "Route Name",
      "description": "Route description",
      "gpxFile": "path/to/route.gpx",
      "difficulty": "Intermediate",
      "distance": "150 miles"
    }
  ]
}
```

## 🎨 Design Features

- **Color Scheme**:

  - Forest Green (Primary): Represents nature and trails
  - Brown (Secondary): Represents dirt and earth
  - Amber (Accent): Represents adventure spirit
  - Light Green: For trail lines
  - Blue Grey: For mountain elements

- **UI Elements**:
  - Gradient borders
  - Hover animations
  - Card-based layout
  - Responsive navigation
  - Interactive map controls

## 📱 Responsive Design

The website is fully responsive and optimized for:

- Desktop (1024px and above)
- Tablet (768px to 1023px)
- Mobile (below 768px)

## 🔧 Customization

### Adding New Routes

1. Add your GPX file to the `assets/gpx/` directory
2. Update `assets/routes.json` with the new route information
3. The route will automatically appear in the routes grid

### Styling

- Colors can be modified in the `:root` variables in `styles.css`
- Layout adjustments can be made in the respective CSS sections
- Animations can be customized in the CSS transitions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Wayne Bonnett - Initial work

## 🙏 Acknowledgments

- Leaflet.js for the mapping functionality
- Font Awesome for the icons
- OpenStreetMap for the map tiles
