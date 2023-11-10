from flask import Flask, request, send_from_directory
from copy import deepcopy
import time
from wasm import WasmModule
from data import DIALPAD_DATA

app = Flask(__name__)

@app.route('/', defaults={'filename': 'index.html'})
@app.route('/<path:filename>')
def serve_static(filename):
    if filename == '':
        filename = 'index.html'
    return send_from_directory('static', filename)

@app.route('/call', methods=['POST'])
def call():
    module = request.form['module']
    timestamp = time.time()
    caller = {
        'number': request.form['number'],
        'country': request.form['country'],
    }

    DIALPAD_DATA['caller'] = caller.copy()
    DIALPAD_DATA['timestamp'] = timestamp

    module = WasmModule(f'modules/{module}.wasm')
    offset = module.get('offset')
    module.write(DIALPAD_DATA, offset)
    assignee = module.run('route')

    DIALPAD_DATA['call_history'].append({
        'caller': caller.copy(),
        'timestamp': timestamp,
        'assignee': assignee,
    })

    # Find agent in CC operators to reply
    for operator in DIALPAD_DATA['operators']:
        if operator['id'] == assignee:
            return (
                f'ID: {operator["id"]}\n'
                f'Name: {operator["name"]}\n'
                f'Number: {operator["number"]}\n'
                f'Country: {operator["country"]}')
    return 'No operator assigned'

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
