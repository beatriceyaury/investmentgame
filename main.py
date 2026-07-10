"""
Optional Python backend for the Investment Game.
This can be used with Flask/FastAPI to serve the HTML files
or handle data processing if needed.
"""

from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)

# Sample route to serve the main page
@app.route('/')
def index():
    return render_template('index.html')

# Sample API endpoint to save game data
@app.route('/api/save', methods=['POST'])
def save_game():
    data = request.get_json()
    # Save to database or file
    with open('game_data.json', 'w') as f:
        json.dump(data, f)
    return jsonify({'status': 'success'})

# Sample API endpoint to load game data
@app.route('/api/load', methods=['GET'])
def load_game():
    try:
        with open('game_data.json', 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({'error': 'No saved data found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
