"""
Investment Game - Python Backend
Serves all HTML pages and handles data persistence
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
import json
import os
from datetime import datetime

app = Flask(__name__)

# Path for storing game data
DATA_FILE = 'game_data.json'

# ----- ROUTES FOR HTML PAGES -----
@app.route('/')
def index():
    """Serve the main game page"""
    return render_template('index.html')

@app.route('/results')
def results():
    """Serve the results page"""
    return render_template('results.html')

@app.route('/portfolio')
def portfolio():
    """Serve the portfolio page"""
    return render_template('portfolio.html')

@app.route('/instructions')
def instructions():
    """Serve the instructions page"""
    return render_template('instructions.html')

# ----- API ENDPOINTS -----
@app.route('/api/save', methods=['POST'])
def save_game_data():
    """
    Save game data to a JSON file
    Expects: { 'history': [...], 'currentCapital': number, 'allReturns': [...] }
    """
    try:
        data = request.get_json()
        
        # Add timestamp to the saved data
        data['saved_at'] = datetime.now().isoformat()
        data['version'] = '1.0'
        
        # Save to file
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        return jsonify({
            'status': 'success',
            'message': 'Game data saved successfully!',
            'saved_at': data['saved_at']
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/load', methods=['GET'])
def load_game_data():
    """Load game data from the JSON file"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
            return jsonify({
                'status': 'success',
                'data': data
            })
        else:
            return jsonify({
                'status': 'empty',
                'message': 'No saved data found',
                'data': {
                    'history': [],
                    'currentCapital': 10000.0,
                    'allReturns': []
                }
            })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/reset', methods=['POST'])
def reset_game_data():
    """Reset game data to initial state"""
    try:
        default_data = {
            'history': [],
            'currentCapital': 10000.0,
            'allReturns': [],
            'saved_at': datetime.now().isoformat(),
            'version': '1.0'
        }
        with open(DATA_FILE, 'w') as f:
            json.dump(default_data, f, indent=2)
        
        return jsonify({
            'status': 'success',
            'message': 'Game data reset successfully!'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get just the history data"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
            return jsonify({
                'status': 'success',
                'history': data.get('history', [])
            })
        else:
            return jsonify({
                'status': 'empty',
                'history': []
            })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

# ----- STATIC FILES -----
@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files like CSS and JS"""
    return send_from_directory('.', filename)

# ----- RUN THE APP -----
if __name__ == '__main__':
    # Create templates folder if it doesn't exist
    if not os.path.exists('templates'):
        os.makedirs('templates')
        print("📁 Created 'templates' folder. Move your HTML files there!")
        print("   Or set your HTML files in the same directory as main.py")
    
    # Check if HTML files are in the right place
    html_files = ['index.html', 'results.html', 'portfolio.html', 'instructions.html']
    missing_files = []
    
    # Check templates folder first
    for file in html_files:
        if not os.path.exists(f'templates/{file}'):
            missing_files.append(file)
    
    if missing_files:
        print("\n⚠️  WARNING: Some HTML files are missing from the 'templates' folder:")
        for file in missing_files:
            print(f"   - {file}")
        print("\n   Either:")
        print("   1. Move your HTML files to the 'templates' folder")
        print("   2. Or run this script from the same folder as your HTML files")
        print("   (The app will try to find them in the current directory as well)\n")
    
    print("🚀 Starting Investment Game server...")
    print("📍 Access the game at: http://127.0.0.1:5000")
    print("📍 Results page: http://127.0.0.1:5000/results")
    print("📍 Portfolio page: http://127.0.0.1:5000/portfolio")
    print("📍 Instructions: http://127.0.0.1:5000/instructions")
    print("📊 Data will be saved to:", DATA_FILE)
    print("Press Ctrl+C to stop the server\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
