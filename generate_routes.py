import os
import json
import xml.etree.ElementTree as ET
from pathlib import Path

def extract_gpx_info(gpx_file):
    """Extract information from a GPX file."""
    try:
        # Parse GPX file
        tree = ET.parse(gpx_file)
        root = tree.getroot()
        
        # Define namespace
        ns = {'gpx': 'http://www.topografix.com/GPX/1/1'}
        
        # Extract name from metadata or use filename
        name_elem = root.find('.//gpx:name', ns)
        name = name_elem.text if name_elem is not None else Path(gpx_file).stem
        
        # Extract description if available
        desc_elem = root.find('.//gpx:desc', ns)
        description = desc_elem.text if desc_elem is not None else f"Route through {name}"
        
        return {
            'name': name,
            'description': description
        }
    except Exception as e:
        print(f"Error processing {gpx_file}: {e}")
        # Fallback to filename if GPX parsing fails
        return {
            'name': Path(gpx_file).stem,
            'description': f"Route through {Path(gpx_file).stem}"
        }

def generate_routes_json():
    """Generate routes.json from GPX files in the assets/gpx directory."""
    # Path to GPX directory
    gpx_dir = Path('assets/gpx')
    
    # Get all GPX files
    gpx_files = list(gpx_dir.glob('*.gpx'))
    
    # Generate routes array
    routes = []
    for i, gpx_file in enumerate(gpx_files, 1):
        info = extract_gpx_info(gpx_file)
        route = {
            'id': i,
            'name': info['name'],
            'description': info['description'],
            'gpxFile': str(gpx_file).replace('\\', '/'),  # Use forward slashes for web paths
            'difficulty': "Intermediate",  # Default value
            'distance': "150 miles"  # Default value
        }
        routes.append(route)
    
    # Create routes.json
    routes_data = {'routes': routes}
    
    # Write to file
    with open('assets/routes.json', 'w') as f:
        json.dump(routes_data, f, indent=4)
    
    print(f"Generated routes.json with {len(routes)} routes")

if __name__ == '__main__':
    generate_routes_json() 