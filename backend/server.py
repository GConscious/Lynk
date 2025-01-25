from flask import Flask
# from flask_cors import CORS

app = Flask(__name__)
# CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/api/events', methods=['GET'])
def hello():
    return {'message': 'Hello, World!'}

if __name__ == '__main__':
    app.run(debug=True)
    
    