from flask import Flask, request, g
from flask_socketio import SocketIO, send, emit
import db_toolkit
import eventlet
import time
from difflib import SequenceMatcher


eventlet.monkey_patch()


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')


@app.teardown_appcontext
def teardown_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()



# SOCKET IO END POINTS
@socketio.on('push_message')
def chat_push_message(data):
    try:
        identifier = data['identifier']
        session_token = data['session_token']
        dest = data['dest']
        body = data['body']
    except Exception as e:
        print('Error')
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    
    # emit message to other party
    # check dest if connected
    query = 'SELECT socket_id FROM users WHERE id=%d'%int(dest)
    res = db_toolkit.query_db(query)[0]['socket_id']

    
    query = 'INSERT INTO messages (sender, dest, body) VALUES (%d,%d,"%s") RETURNING id'%(int(identifier), int(dest), body)
    mid = db_toolkit.post_db(query, ret=True) # message id
    
    #if res != 'undefined':
    emit('accpt_message', {'id':mid, 'dest':dest, 'sender':identifier, 'body':body,'timestamp':int(time.time()), 'seen':0 }, broadcast=True)

    
    return {'status':'ok'}


@socketio.on('pull_convo')
def chat_pull_convo(params):
    query = 'SELECT id, sender, dest, body,timestamp, seen FROM messages WHERE (sender=%d AND dest=%d) OR (sender=%d AND dest=%d) ORDER BY id ASC'%(int(params['identifier']), int(params['party_id']),int(params['party_id']), int(params['identifier']))
    data = db_toolkit.query_db(query)
    print('=====================')
    print(data)
    print('=====================')

    emit('accpt_convo', data, room=request.sid)



def keyfunc(contact):
    return contact['last_message']['id']
def keyfunc2(output):
    return output['order']


@socketio.on('pull_contacts')
def chat_pull_contacts(auth, search_key=None):
    query = 'SELECT distinct(dest) AS party FROM messages WHERE sender=%d AND dest!=%d UNION SELECT distinct(sender) AS party FROM messages WHERE sender!=%d AND dest=%d '%(int(auth['identifier']),int(auth['identifier']),int(auth['identifier']),int(auth['identifier']))
    res = db_toolkit.query_db(query)
    output = []
    
    if search_key:
        print('==============')
        print('search key is activated : ' + str(search_key))
        print('==============')



    for single in res:
        # fetch account info
        query = 'SELECT account_name FROM users WHERE id=%d '%int(single['party'])
        print('============')
        print(single)
        print(db_toolkit.query_db(query))
        print('============')

        account_name = db_toolkit.query_db(query)[0]['account_name']
        query = 'SELECT id, timestamp, body, sender, dest, seen FROM messages WHERE (sender=%d AND dest=%d) OR (sender=%d AND dest=%d) ORDER BY id DESC LIMIT 1'%(int(single['party']), int(auth['identifier']), int(auth['identifier']), int(single['party']))
        res1 = db_toolkit.query_db(query)[0]    
        last_message = {
            'id':res1['id'],
            'sender':res1['sender'],
            'dest':res1['dest'],
            'body':res1['body'],
            'timestamp':str(res1['timestamp']),
            'seen':res1['seen']
        }
        #check if user connected
        query = 'SELECT socket_id FROM users WHERE id=%d'%int(single['party'])
        socket_id = db_toolkit.query_db(query)[0]['socket_id']
        online = 0
        if socket_id != 'undefined':
            online = 1

        output.append({'id':single['party'], 'account_name':account_name, 'last_message':last_message, 'online':online})
    
    if search_key and len(search_key) > 0:
        # search by account name in contacts
        new_output = []
        for single in output:
            new_single = single
            order = SequenceMatcher(None, search_key, single['account_name']).ratio()
            new_single['order'] = order
            new_output.append(new_single)
        output = new_output

    if search_key and len(search_key) > 0:
        output.sort(key=keyfunc2, reverse=True)
        emit('accpt_contacts_search', output, room=request.sid)

    else:
        output.sort(reverse=True, key=keyfunc)
        emit('accpt_contacts', output, room=request.sid)

@socketio.on('connect')
def chat_connect(auth):
    # NEW USER CONNECTED TO THE CHAT        
    query = 'UPDATE users SET socket_id="%s" WHERE id=%d AND session_token="%s"'%(request.sid, int(auth['identifier']), auth['session_token'])
    db_toolkit.post_db(query)
    return 'ok'

@socketio.on('disconnect')
def chat_disconnect():
    # USER DISCONNECTED FROM CHAT
    query = 'UPDATE users SET socket_id="undefined" WHERE socket_id="%s"'%request.sid
    db_toolkit.post_db(query)
    return 'ok'


if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=4000)