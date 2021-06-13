from flask import flash, Flask, g, redirect, url_for, request,send_from_directory
import sqlite3

from flask.globals import session
import db_toolkit
import uio
import string
import hashlib
import random
import procedures
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import json
import time

from datetime import date


#app = Flask(__name__, static_url_path='/static')
app = Flask(__name__, static_url_path='', static_folder='frontend/build')

cors = CORS(app, resources={r"/api/*": {"origins": "*"}, r'/uploadFile':{"origins": "*"}})

UPLOAD_FOLDER = 'static'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])


@app.teardown_appcontext
def teardown_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

## MAIN SERVER

# Serve React App
@app.route('/', methods=['GET'])
def index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/login', methods=['GET'])
def login_page():
    return send_from_directory(app.static_folder, 'index.html')
    
@app.route('/dashboard', methods=['GET'])
def login_page():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/checkAlive', methods=['GET'])
def checkAlive():
    try:
        user_id = uio.getField('user_id', allowed_chars=string.digits)
        session_token = uio.getField(
            'session_token', allowed_chars=string.digits+string.ascii_letters)
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    query = 'SELECT account_name, account_type FROM users WHERE id=%d AND session_token="%s" ' % (
        int(user_id), session_token)
    data = db_toolkit.query_db(query)
    if(len(data) == 0):
        return {'status': 'error', 'reason': 2}  # SESSION EXPIRED
    else:
        return {'status': 'ok', 'data': data[0]}


'''
REGISTERATION API
1. Field error
2. Error executing query
'''


@app.route('/api/register', methods=['POST'])
def register():
    try:
        account_name = uio.getField(
            'account_name', allowed_chars=string.ascii_letters + string.digits + ' ')
        email = uio.getField(
            'email', allowed_chars=string.ascii_letters + string.digits + '@._')
        password = uio.getField('password', allowed_chars='everything')
        phone_number = uio.getField(
            'phone_number', allowed_chars=string.digits)
        account_type = uio.getField('account_type', allowed_chars=string.ascii_letters)
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    query = 'INSERT INTO users (account_name, email, phone_number, password_val, account_type) VALUES ("%s", "%s", "%s", "%s", "%s")' % (
        account_name, email, phone_number, password, account_type)
    try:
        db_toolkit.post_db(query)
        return {'status': 'ok'}
    except Exception as e:
        return {'status': 'error', 'reason': 2, 'field': str(e)}


@app.route('/api/checkEmailExists', methods=['GET'])
def checkEmailExsits():
    try:
        email = uio.getField(
            'email', allowed_chars=string.ascii_letters + string.digits + '@._')
    except Exception as e:
        return {'status': 'error', 'reason': 2, 'field': str(e)}
    query = 'SELECT id FROM users WHERE email="%s" ' % email
    data = db_toolkit.query_db(query)
    if(len(data) > 0):
        return {'status': 'ok', 'available': 'no'}
    else:
        return {'status': 'ok', 'available': 'yes'}


'''

'''


@app.route('/api/login', methods=['GET'])
def login():
    try:
        identifier = uio.getField(
            'identifier', allowed_chars=string.digits+string.ascii_letters+'@._-+')
        password = uio.getField(
            'password', allowed_chars=string.digits+string.ascii_letters+' '+string.punctuation)
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}

    # hash password
    # password = hashlib.md5(password.encode('utf-8')).hexdigest()
    # check if the given info matcha user
    query = 'SELECT id, verified  FROM users WHERE email="%s" AND password_val="%s"' % (
        identifier, password)

    r = db_toolkit.query_db(query)

    if len(r) == 0:
        return {'status': 'error', 'reason': 2}
    else:
        if(r[0]['verified'] == 0):
            return {'status': 'error', 'reason': 3}
        else:
            # generate session token
            session_token = ''.join(random.choice(
                string.ascii_uppercase + string.digits) for _ in range(32))
            query = 'UPDATE users SET session_token="%s" WHERE email="%s" OR phone_number="%s" ' % (
                session_token, identifier, identifier)
            db_toolkit.post_db(query)
            return {'status': 'ok', 'id': r[0]['id'], 'session_token': session_token}


@app.route('/api/fetchAccountInfo', methods=['GET'])
def fetchAccountInfo():
    try:
        identifier = int(uio.getField('identifier', allowed_chars=string.digits))
        session_token = uio.getField('session_token', allowed_chars=string.digits+string.ascii_letters)
    except Exception as e:
        return {'status': 'error', 'field': str(e)}
    # check if user exists
    query = 'SELECT account_name, email, phone_number, account_type, rating, residency, join_date, bio FROM users WHERE id=%d'%(identifier)
    data = db_toolkit.query_db(query)
    return {'status':'ok', 'data':data[0]}


@app.route('/api/changeAccountInfo', methods=['POST'])
def changeAccountInfo():
    try:
        identifier = int(uio.getField('identifier', allowed_chars=string.digits))
        session_token = uio.getField('session_token', allowed_chars=string.digits+string.ascii_letters)
        fields = uio.getFieldJson('fields')
    except Exception as e:
        return {'status': 'error', 'field': str(e)}
    
    
    query = 'UPDATE users SET'
    first = True
    for key, value in fields.items():
        if not first:
            query += ' ,'
        query += ' ' + key + '="' + value+'"' 
        first = False
    
    query += ' WHERE id=%d AND session_token="%s"'%(identifier, session_token)
    print("======================")
    print(query)
    print("======================")

    try:
        db_toolkit.post_db(query)
    except Exception as e:
        print(e)
        return {'status': 'error', 'reason': 'database'}

    return {'status':'ok'}
 
@app.route('/api/changeAccountPassword', methods=['POST'])
def changeAccountPassword():
    try:
        identifier = int(uio.getField('identifier', allowed_chars=string.digits))
        session_token = uio.getField('session_token', allowed_chars=string.digits+string.ascii_letters)
        password = uio.getFieldValue('password')
    except Exception as e:
        return {'status': 'error', 'field': str(e)}
    if procedures.checkSessionToken(identifier, session_token):
        query = 'UPDATE users SET password_val="%s" WHERE id=%d'%(password, identifier)
        db_toolkit.post_db(query)
        return {'status':'ok'}
    return {'status':'error'}
    
    


'''
1. Field error
2. Identifier not found
'''


@app.route('/api/reset/GetInfo', methods=['GET'])
def reset_step1():
    try:
        identifier = uio.getField(
            'identifier', allowed_chars=string.digits+string.ascii_letters+'@._-+')
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    # get email and phone number
    query = 'SELECT email, phone_number FROM users WHERE email="%s" OR phone_number="%s"' % (
        identifier, identifier)
    data = db_toolkit.query_db(query)
    if len(data) == 0:
        return {'status': 'error', 'reason': 2}
    else:
        return {'status': 'ok', 'data': data[0]}


@app.route('/api/reset/sendVerifCode', methods=['POST'])
def reset_step2():
    # SEND VERIF CODE
    try:
        identifier = uio.getField(
            'identifier', allowed_chars=string.digits+string.ascii_letters+'@._-+')
        meth = uio.getField('meth', allowed_chars='01')  # 0 : Mail | 1 : Phone
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    # get email and phone number
    query = 'SELECT email, phone_number FROM users WHERE email="%s" OR phone_number="%s"' % (
        identifier, identifier)
    data = db_toolkit.query_db(query)
    # generate random code & save it fl db
    code = ''.join(random.choice(string.digits) for _ in range(5))
    query = 'UPDATE users SET verif_code=%d WHERE email="%s" OR phone_number="%s"' % (
        int(code), identifier, identifier)
    db_toolkit.post_db(query)
    # send code
    if(int(meth) == 0):
        procedures.sendVerifEmail(data[0]['email'], code)
    else:
        procedures.sendVerifPhone(data[0]['phone_number'], code)
    return {'status': 'ok'}


@app.route('/api/reset/checkCode', methods=['GET'])
def checkCode():
    # MUST IMPLIMENT : when the user tries more than x times the code changes
    #                   check if code expired with time
    try:
        identifier = uio.getField(
            'identifier', allowed_chars=string.digits+string.ascii_letters+'@._-+')
        code = uio.getField('code', allowed_chars=string.digits)
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}

    query = 'SELECT id FROM users WHERE (email="%s" OR phone_number="%s") AND verif_code="%s"' % (
        identifier, identifier, code)
    data = db_toolkit.query_db(query)
    if len(data) > 0:
        return {'status': 'ok', 'valid': 'yes'}
    else:
        return {'status': 'ok', 'valid': 'no'}


'''
1. Field error
2. Wrong verif code
'''


@app.route('/api/reset/changePassword', methods=['POST'])
def changePassword():
    try:
        identifier = uio.getField(
            'identifier', allowed_chars=string.digits+string.ascii_letters+'@._-+')
        new_password = uio.getField('password', allowed_chars='everything')
        code = uio.getField('code', allowed_chars=string.digits)
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}

    if((len(code) != 5) or (code == '')):
        return {'status': 'error', 'status': 2}

    # check if the code is valid
    query = 'SELECT id FROM users WHERE (email="%s" OR phone_number="%s") AND verif_code="%s"' % (
        identifier, identifier, code)
    data = db_toolkit.query_db(query)
    if len(data) == 0:
        return {'status': 'error', 'status': 2}
    # UPDATE password & clear verif code
    query = 'UPDATE users SET password_val="%s", verif_code="" WHERE email="%s" OR phone_number="%s"' % (
        new_password, identifier, identifier)
    db_toolkit.post_db(query)
    return {'status': 'ok'}


@app.route('/api/listing/add', methods=['POST'])
def addListing():
    try:
        # ACCOUNT DETAILS
        identifier = uio.getField(
            'identifier', allowed_chars=string.digits)
        session_token = uio.getField(
            'session_token', allowed_chars=string.digits+string.ascii_letters)
        # LISTING DETAILS
        #prop_title = uio.getField(
        #    'prop_title', allowed_chars=string.digits+string.ascii_letters+' +')
        prop_price = uio.getField('prop_price', allowed_chars=string.digits)
        prop_desc = uio.getField(
            'prop_desc', allowed_chars='everything')
        prop_piece = int(uio.getField('prop_piece', allowed_chars=string.digits))
        prop_type = int(uio.getField('prop_type', allowed_chars=string.digits))
        prop_status = int(uio.getField('prop_status', allowed_chars=string.digits))
        location_city = uio.getField(
            'location_city', allowed_chars=string.digits+string.ascii_letters+' ')
        location_region = uio.getField(
            'location_region', allowed_chars=string.digits+string.ascii_letters+' ')
        location_cord_lat = uio.getField('location_cord_lat', allowed_chars=string.digits+'.-')
        location_cord_lng = uio.getField('location_cord_lng', allowed_chars=string.digits+'.-')
        images = uio.getField('images', allowed_chars='everything')
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    if(procedures.checkSessionToken(identifier, session_token) == False):
        return {'status': 'error', 'reason': 2}

    if prop_status == 0:
        prop_status_value = 'For rental'
    elif prop_status == 1:
        prop_status_value = 'For sale'
    elif prop_status == 2:
        prop_status_value = 'Co-location'
    
    today = date.today()
    d = today.strftime("%d/%m/%Y")


    if prop_type == 0:
        prop_type_value = 'Duplex'
    elif prop_type == 1:
        prop_type_value = 'Apartment'
    elif prop_type == 2:
        prop_type_value = 'Studio'
    elif prop_type == 3:
        prop_type_value = 'House'
    
   
    prop_title = '%s S+%d %s'%(prop_type_value, prop_piece, location_region)

    data = json.loads(images)
    # INSERT LISTING
    sql = '''INSERT INTO listings (prop_title, prop_price, prop_desc,prop_type, prop_status, prop_owner, prop_piece, location_city, location_region,post_date, location_cord_lat, location_cord_lng) 
                            VALUES ("%s", %d, "%s",%d, %d, %d, %d, "%s", "%s","%s", "%s", "%s")''' % (
        prop_title, int(prop_price), prop_desc,prop_type, prop_status, int(identifier), int(prop_piece), location_city, location_region,d, location_cord_lat, location_cord_lng)
    
    lid = db_toolkit.post_db(sql)
    print('========')
    print(sql)
    print('========')

    images = data

    for img in images:
        query = 'UPDATE images SET post_id=%d,filename="%s" WHERE id=%d'%(int(lid), img['url'].split('/')[-1],int(img['imid']))
        db_toolkit.post_db(query)


    return {'status': 'ok'}


@app.route('/api/listing/delete', methods=['POST'])
def deleteListing():
    try:
        identifier = uio.getField(
            'identifier', allowed_chars=string.digits+string.ascii_letters+'@._-+')
        session_token = uio.getField(
            'session_token', allowed_chars=string.digits+string.ascii_letters)
        prop_id = uio.getField('identifier', allowed_chars=string.digits)
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    # remove record from db and remove files


@app.route('/api/listing/fetch', methods=['GET'])
def fetchListing():
    try:
        owner_id = uio.getField('owner_id', allowed_chars=string.digits)
    except Exception as e:
        owner_id = -1
    # Search query
    try:
        city = uio.getField('city', allowed_chars=string.ascii_letters+' '+string.digits)
    except Exception as e:
        city = '*'
    
    try:
        region = uio.getField('region', allowed_chars=string.ascii_letters+' '+string.digits)
    except Exception as e:
        region = '*'
    
    try:
        prop_type = uio.getField('prop_type', allowed_chars=string.digits+'-+')
    except Exception as e:
        prop_type = '*'
    try:
        sort_by = uio.getField('sort_by', allowed_chars=string.digits)
    except Exception as e:
        sort_by = 0
    
    query = 'SELECT * FROM listings '
    
    conditions = []


    if(int(owner_id) > -1):
        conditions.append('prop_owner=%d '%int(owner_id))
    if(city != '*'):
        conditions.append('location_city="%s" '%city)
    if(region != '*'):
        conditions.append('location_region="%s"'%region)
    if(prop_type != '*'):
        conditions.append('prop_type="%s"'%prop_type)
    
    if(len(conditions) > 0):
        query += ' WHERE ' + ' AND '.join(conditions)

    if(int(sort_by) == 0):
        query += ' ORDER BY id DESC '
    elif(int(sort_by) == 1):
        query += ' ORDER BY prop_price DESC '
    elif(int(sort_by) == -1):
        query += ' ORDER BY prop_price ASC '
    
    print("=========================")
    print(query)
    print("=========================")

    data = db_toolkit.query_db(query)
    new_data = []
    for single in data:
        # get stat
        v_query = 'SELECT count(DISTINCT B.idfa) AS "views" FROM behaviours B, listings L WHERE B.action = "view" AND B.asset_id=L.id AND L.id=%d'%int(single['id']) # VIEWS QUERY
        c_query = 'SELECT count(DISTINCT B.idfa) AS "clicks" FROM behaviours B, listings L WHERE B.action = "click" AND B.asset_id=L.id AND L.id=%d'%int(single['id']) # VIEWS QUERY
        v_value = db_toolkit.query_db(v_query)[0]['views']
        c_value = db_toolkit.query_db(c_query)[0]['clicks']
        # get owner profile info
        query2 = 'SELECT account_name FROM users WHERE id=%d'%(int(single['prop_owner']))
        res = db_toolkit.query_db(query2)
        # get property pictures
        query3 = 'SELECT filename FROM images WHERE post_id=%d'%(single['id'])
        res2 = db_toolkit.query_db(query3)
        n_single = single
        n_single.update({'nbr_views':v_value})
        n_single.update({'nbr_clicks':c_value})
        n_single.update({'owner':res[0]})
        n_single.update({'images':res2})
        new_data.append(n_single)
    
    return {'status': query, 'data': new_data}

@app.route('/api/single/fetch', methods=['GET'])
def fetchSingle():
    try:
        sid = uio.getField('id', allowed_chars=string.digits)
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    query = 'SELECT * FROM listings WHERE id = %d '%int(sid)
    data = db_toolkit.query_db(query)
    new_data = []
    for single in data:
        # get owner profile info
        query2 = 'SELECT account_name FROM users WHERE id=%d'%(int(single['prop_owner']))
        res = db_toolkit.query_db(query2)
        # get property pictures
        query3 = 'SELECT filename FROM images WHERE post_id=%d'%(single['id'])
        res2 = db_toolkit.query_db(query3)
        n_single = single
        n_single.update({'owner':res[0]})
        n_single.update({'images':res2})
        new_data.append(n_single)

    return {'status':'ok', 'data':new_data[0]}

@app.route('/uploadFile', methods=['POST'])
def fileUpload():
    try:
        identifier = uio.getField(
            'identifier', allowed_chars=string.digits)
        session_token = uio.getField('session_token', allowed_chars=string.digits+string.ascii_letters)
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    
    target = os.path.join(UPLOAD_FOLDER, 'uploads')
   
    query = 'INSERT INTO images (owner_id) VALUES ("%s")'%(int(identifier))
    fid = db_toolkit.post_db(query)

    file = request.files['file']
    filename = str(fid) + '.' + file.filename.split(".")[-1]
    destination = "/".join([target, filename])
    file.save(destination)
    #return {'status':'ok', 'direct_link':'http://localhost:5000/'+destination}
    return {'status':'ok', 'direct_link':'http://localhost:5000/'+destination, 'fid':fid}

@app.route('/api/changeAvatar', methods=['POST'])
def changeAvatar():
    try:
        identifier = uio.getField('identifier', allowed_chars=string.digits)
        session_token = uio.getField('session_token', allowed_chars=string.digits+string.ascii_letters)
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    file = request.files['file']
    filename = str(identifier) + '.' + file.filename.split(".")[-1]
    if file.filename.split(".")[-1].upper() == 'JPG':
        target = os.path.join(UPLOAD_FOLDER, 'avatars')
    else:
        target = os.path.join(UPLOAD_FOLDER, 'temp')
    
    destination = "/".join([target, filename])
    file.save(destination)
    # convert file to jpg if the extention is not jpg
    if file.filename.split(".")[-1].upper() != 'JPG':
        procedures.convertImage(filename, str(identifier)) # filename without extention
    return {'status':'ok', 'direct_link':'http://localhost:5000/'+destination}


@app.route('/api/checkPassword', methods=['POST'])
def checkPassword():
    try:
        identifier = uio.getField('identifier', allowed_chars=string.digits)
        session_token = uio.getField('session_token', allowed_chars=string.digits+string.ascii_letters)
        password_value = uio.getField('password', allowed_chars='everything')
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    
    #check session token
    if(procedures.checkSessionToken(identifier, session_token) == False):
        return {'status':'error', 'reason':1}
    # check password validity
    query = 'SELECT id FROM users WHERE id=%d AND password_val="%s"'%(int(identifier),password_value)


    data = db_toolkit.query_db(query)
    
    if(len(data) == 0):
        return {'status':'error', 'reason':2}

    return {'status':'ok'}





'''
1. Invalid field
2. Expired session token
'''


@app.route('/api/reviews/add', methods=['POST'])
def addReview():
    try:
        identifier = uio.getField(
            'identifier', allowed_chars=string.digits+string.ascii_letters+'@._-+')
        session_token = uio.getField(
            'session_token', allowed_chars=string.digits+string.ascii_letters)
        rating = uio.getField('rating', allowed_chars='123456')
        body = uio.getField(
            'body', allowed_chars=string.digits+string.ascii_letters+' @._-+')
        post_id = uio.getField('post_id', allowed_chars=string.digits)
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    if(procedures.checkSessionToken(identifier, session_token) == False):
        return {'status': 'error', 'reason': 2}
    query = 'INSERT INTO reviews (owner_id, post_id ,rating, body) VALUES (%d, %d, %d, "%s")' % (
        int(identifier), int(post_id), int(rating), body)
    db_toolkit.post_db(query)
    return {'status': 'ok'}


@app.route('/api/reviews/fetch', methods=['GET'])
def fetchReviews():
    try:
        post_id = uio.getField('post_id', allowed_chars=string.digits)
        try:
            marker = int(uio.getField('marker', allowed_chars=string.digits))
        except Exception as e:
            marker = -1
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    
    query = 'SELECT * FROM reviews WHERE post_id = %d ORDER BY id DESC' % int(post_id)
    
    if marker!=-1:
        query += ' LIMIT %d'%(marker)

    
    data = db_toolkit.query_db(query)

    return {'status': 'ok', 'data': data}


@app.route('/api/widgets/fetch', methods=['GET'])
def widgetFetch():
    try:
        identifier = int(uio.getField(
            'identifier', allowed_chars=string.digits))
        session_token = uio.getField(
            'session_token', allowed_chars=string.digits+string.ascii_letters)
    except Exception as e:
        return {'status':'error', 'reason':1, 'field':str(e)}
    v_query = 'SELECT count(DISTINCT B.idfa) AS "views" FROM behaviours B, listings L WHERE B.action = "view" AND B.asset_id=L.id AND L.prop_owner=%d'%int(identifier) # VIEWS QUERY
    c_query = 'SELECT count(DISTINCT B.idfa) AS "clicks" FROM behaviours B, listings L WHERE B.action = "click" AND B.asset_id=L.id AND L.prop_owner=%d'%int(identifier) # VIEWS QUERY
    b_query = 'SELECT balance FROM users WHERE id=%d'%(identifier)
    l_query = 'SELECT count(id) AS "listings" FROM listings WHERE prop_owner=%d'%(identifier)
    
    v_value = db_toolkit.query_db(v_query)[0]['views']
    c_value = db_toolkit.query_db(c_query)[0]['clicks']
    b_value = db_toolkit.query_db(b_query)[0]['balance']
    l_value = db_toolkit.query_db(l_query)[0]['listings']

    return {'status':'ok', 'data':{'views':v_value, 'clicks':c_value, 'balance':b_value, 'listings':l_value}}


## =================================
## CHAT SERVER
## =================================

@app.route('/api/chat/pull', methods=['GET', 'POST'])
def pull():
    if request.method == 'GET':
        try:
            senderId = int(request.args.get('senderId'))
            destId = int(request.args.get('destId'))
            marker = int(request.args.get('marker'))
            session_token = request.args.get('session_token')
        except:
            return 'XERROR #001'
    else:
        return 'BAD REQUEST'
    if(procedures.checkSessionToken(senderId, session_token)==False and procedures.checkSessionToken(destId, session_token)==False):
        return {'status':'error', 'reason':'INVALID TokEN'}
    r = '0'
    if(marker == -1):
        query = 'SELECT * FROM messages WHERE (sender=%d AND dest=%d) OR (sender=%d AND dest=%d) ORDER BY id DESC LIMIT 1'%(senderId, destId, destId, senderId)
        r = db_toolkit.query_db(query)
    else:
        query = 'SELECT * FROM messages WHERE ((sender=%d AND dest=%d) OR (sender=%d AND dest=%d)) AND id > %d '%(senderId, destId, destId, senderId, marker)
        r = db_toolkit.query_db(query)
    return {'status':'ok', 'data':r}



@app.route('/api/chat/push', methods=['POST'])
def push():
    try:
        senderId = uio.getField('senderId', allowed_chars=string.digits)
        destId = uio.getField('destId', allowed_chars=string.digits)
        body = uio.getField('body', allowed_chars='everything')
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}

    query = 'INSERT INTO messages (sender, dest, body, type) VALUES (%d,%d,"%s", "message")'%(int(senderId), int(destId), body)
    db_toolkit.post_db(query)
    return {'status':'ok'}

@app.route('/api/chat/recentConvos', methods=['GET', 'POST'])
def recentConvos():
    if request.method == 'GET':
        try:    
            uid = int(request.args.get('uid'))
            session_token = request.args.get('session_token')
        except:
            return 'ERROR #001'
    query = 'SELECT DISTINCT U.id, U.account_name FROM users U, messages M WHERE (M.sender='+str(uid)+' OR M.dest='+str(uid)+')  AND (U.id = M.sender OR U.id = M.dest) AND (U.id != ' + str(uid) + ') ORDER BY M.id DESC'
    r = db_toolkit.query_db(query)
    print(r)
    r2 = []
    for d in r:
        query = 'SELECT body, sender FROM messages WHERE (sender=%d AND dest=%d) OR (sender=%d AND dest=%d) ORDER BY id DESC LIMIT 1'%(int(d['id']), uid, uid, int(d['id']))
        data = db_toolkit.query_db(query)
        d.update({'lastMsg':data[0]['body']})
        d.update({'lastMsgSender':data[0]['sender']})
        r2.append(d)
    return {'status':'ok', 'data':r}

@app.route('/api/chat/contacts', methods=['GET', 'POST'])
def contacts():
    query = 'SELECT id, name FROM users'
    print(query)
    r = db_toolkit.query_db(query)
    return {'status':'ok', 'data':r}


@app.route('/api/chat/getAccountDetails', methods=['GET'])
def getAccountDetails():
    try:
        uid = uio.getField('id', allowed_chars=string.digits)
    except Exception as e:
        return {'status': 'error', 'reason': 1, 'field': str(e)}
    query = 'SELECT account_name, email FROM users WHERE id=%d '%int(uid)
    r = db_toolkit.query_db(query)
    print(r)
    return {'status':'ok', 'data':r[0]}
    #return 'ok'


@app.route('/api/chat/online', methods=['GET', 'POST'])
def online():
    try:
        uid = request.args.get('uid')
        session_token = request.args.get('session_token')
    except:
        return 'ERROR #03'
    currentTime = datetime.now()
    query = 'UPDATE FROM users SET active="%s" WHERE id=%d'%(token, int(uid))
    db_toolkit.post_db(query)
    return {'status':'ok'}


@app.route('/api/chat/mark-as-seen', methods=['POST'])
def markAsSeen():
    try:
        identifier = int(uio.getField('identifier', allowed_chars=string.digits))
        session_token = uio.getField('session_token', allowed_chars=string.digits+string.ascii_letters)
        partyId = int(uio.getField('party_id', allowed_chars=string.digits));
    except Exception as e:
        return {'status':'error', 'reason':1, 'field':str(e)}

    query = 'UPDATE messages SET seen=1 WHERE sender=%d AND dest=%d'%(partyId, identifier)
    db_toolkit.post_db(query)
    return {'status':'ok'}

### ADVERTISEMENT AND USER TRACKING
@app.route('/api/fa/join', methods=['GET'])
def join():
    ip = request.remote_addr
    # Generate idfa
    query = 'INSERT INTO visitors (ip) VALUES ("%s")'%ip
    idfa = db_toolkit.post_db(query)
    return {'status':'ok', 'idfa':idfa}

@app.route('/api/fa/capture_behaviour', methods=['POST'])
def cap_behaviour():
    ip = request.remote_addr
    try:
        idfa = int(uio.getField('idfa', allowed_chars=string.digits))
    except Exception as e:
        print("IDFA not provided, creating new one.")
        r = join()
        idfa = int(r['idfa'])
    try:
        action = uio.getField('action', allowed_chars=string.ascii_lowercase+'-')
        asset_id = int(uio.getField('asset_id', allowed_chars=string.digits))
    except Exception as e:
        return {'status':'error', 'reason':1} # 1: action is not defined
    if (action not in ['click', 'view']):
        return {'status':'error', 'reason':2} # 1: action is not valid
    # UPDATE IP ADDRESS
    query = 'UPDATE visitors SET ip="%s" WHERE idfa=%d'%(ip, idfa)
    db_toolkit.post_db(query)
    # CAPTURE BEHAVIOUR
    ts = time.time()#TIMESTAMP
    query = 'INSERT INTO behaviours (idfa, action, asset_id, timestamp) VALUES (%d, "%s", %d, %d)'%(idfa, action,asset_id, ts)
    db_toolkit.post_db(query)
    return {'status':'ok', 'idfa':idfa}



# MONEEEEEEEEEEEEY

@app.route('/api/getBalance', methods=['GET'])
def getBalance():
    try:
        identifier = uio.getField('identifier', allowed_chars=string.digits) 
        session_token = uio.getField('session_token', allowed_chars=string.digits+string.ascii_letters)
    except Exception as e:
        return {'status':'error', 'reason':1, 'field':str(e)}
    if(not procedures.checkSessionToken(identifier, session_token)):
        return {'status':'error', 'reason':2}
    query = 'SELECT balance FROM users WHERE id=%d'%int(identifier)
    balance_value = db_toolkit.query_db(query)[0]['balance']
    
    return {'status': 'ok', 'balance':balance_value}

@app.route('/api/transactions/make', methods=['POST'])
def makeTransaction():
    try:
        identifier = uio.getField('identifier', allowed_chars=string.digits)
        session_token = uio.getField('session_token', allowed_chars=string.digits+string.ascii_letters)
        password = uio.getField('password', allowed_chars='everything')
        dest = uio.getField('dest_id', allowed_chars=string.digits)
        amount = int(uio.getField('amount', allowed_chars=string.digits))
        description = uio.getField('description', allowed_chars=string.ascii_letters+string.digits+' .,!?')
    except Exception as e:
        return {'status':'error', 'reason':1, 'field':str(e)}
    #check session token
    if(procedures.checkSessionToken(identifier, session_token) == False):
        return {'status':'error', 'reason':1}
    # check password validity
    query = 'SELECT id FROM users WHERE id=%d AND password_val="%s"'%(int(identifier),password)
    data = db_toolkit.query_db(query)
    if(len(data) == 0):
        return {'status':'error', 'reason':2}
    # amount conditions
    if(int(amount) <= 0):
        return {'status':'error', 'reason':3}
    # check funds suffeciency
    query = 'SELECT balance FROM users WHERE id=%d'%int(identifier)
    balance_value = db_toolkit.query_db(query)[0]['balance']
    if int(amount) > int(balance_value):
        # unsufficient funds
        return {'status':'error', 'reason':4}
    # record transaction
    query = 'INSERT INTO transactions (sender, dest, amount, description, timestamp) VALUES (%d, %d, %d,"%s", %d)'%(int(identifier), int(dest), int(amount), description, time.time())
    print('==================')
    print(query)
    db_toolkit.post_db(query)
    # edit balance
    query = 'UPDATE users SET balance=balance-%d WHERE id=%d'%(int(amount), int(identifier))
    db_toolkit.post_db(query)
    query = 'UPDATE users SET balance=balance+%d WHERE id=%d'%(int(amount), int(dest))
    db_toolkit.post_db(query)
    # Add to chat
    query = 'INSERT INTO messages (sender, dest, body, type, amount) VALUES (%d, %d, "", "money", %d)'%(int(identifier), int(dest), int(amount))
    db_toolkit.post_db(query)

    return {'status':'ok'}


@app.route('/api/transactions/fetch_last_parties', methods=['GET'])
def fetch_last_parties():
    try:
        identifier = int(uio.getField('identifier', allowed_chars=string.digits))
    except Exception as e:  
        return {'status':'error', 'reason':1, 'field':str(e)}
    query = 'SELECT DISTINCT(dest) FROM transactions WHERE sender=%s ORDER BY id DESC LIMIT 3'%identifier
    data = db_toolkit.query_db(query)
    return {'status':'ok', 'data':data}




@app.route('/api/transactions/pull', methods=['GET'])
def pullTransactions():
    try:
        identifier = int(uio.getField('identifier', allowed_chars=string.digits))
        limit = int(uio.getField('limit', allowed_chars=string.digits))
        try:
            destinator = int(uio.getField('dest', allowed_chars=string.digits))
        except Exception as e:
            destinator = -1
    except Exception as e:
        return {'status':'error', 'reason':1, 'field':str(e)}
    if destinator == -1:
        query = 'SELECT T.*, U.account_name, U.email FROM transactions T, users U WHERE (T.sender=%d OR T.dest=%d) AND ((T.sender = U.id OR T.dest = U.id) AND (U.id != %d))'%(int(identifier),int(identifier),int(identifier))
    else:
        query = 'SELECT * FROM transactions WHERE (sender=%d AND dest=%d) OR (sender=%d AND dest=%d)'%(identifier, destinator, destinator, identifier)
    if limit != -1:
        query += ' LIMIT %d'%(limit)
    data = db_toolkit.query_db(query)
    return {'status':'ok', 'data':data}


# ============ NOTIFICATIONS

@app.route('/api/notifs/pull', methods=['GET'])
def pull_notifs():
    try:
        identifier = uio.getField('identifier', allowed_chars=string.digits)
        session_token = uio.getField('session_token', allowed_chars=string.digits+string.ascii_letters)
    except Exception as e:
        return {'status':'error', 'reason':1, 'field':str(e)}
    query = 'SELECT * FROM notifications WHERE uid=%d'%int(identifier)
    data = db_toolkit.query_db(query)
    return {'status':'ok', 'data':data}        


# WISH LIST
@app.route('/api/wish/exist', methods=['GET'])
def wish_exist():
    try:
        idfa = uio.getField('idfa', allowed_chars=string.digits)
        pid = uio.getField('pid', allowed_chars=string.digits)
    except Exception as e:
        return {'status':'error', 'reason':1, 'field':str(e)}
    query = 'SELECT * FROM wishlist WHERE idfa=%d AND pid=%d'%(int(idfa), int(pid))
    data = db_toolkit.query_db(query)
    if(len(data) > 0):
        return {'status':'ok', 'exist':'yes'}
    else:
        return {'status':'ok', 'exist':'no'}

@app.route('/api/wish/toggle', methods=['POST'])
def wish_toggle():
    try:
        idfa = uio.getField('idfa', allowed_chars=string.digits)
        pid = uio.getField('pid', allowed_chars=string.digits)
    except Exception as e:
        return {'status':'error', 'reason':1, 'field':str(e)}
    # check if wished
    query = 'SELECT * FROM wishlist WHERE idfa=%d AND pid=%d'%(int(idfa), int(pid))
    data = db_toolkit.query_db(query)
    if(len(data) > 0):
        query = 'DELETE FROM wishlist WHERE idfa=%d AND pid=%d'%(int(idfa), int(pid))
    else:
        query = 'INSERT INTO wishlist (idfa, pid) VALUES (%d, %d)'%(int(idfa), int(pid))
    db_toolkit.post_db(query)
    return {'status':'ok'}        

@app.route('/api/wish/fetch', methods=['GET'])
def wish_fetch():
    try:
        idfa = uio.getField('idfa', allowed_chars=string.digits)
    except Exception as e:
        return {'status':'error', 'reason':1, 'field':str(e)}
    query = 'SELECT L.* FROM listings L, wishlist W WHERE W.idfa=%d AND L.id = W.pid'%int(idfa)
    data = db_toolkit.query_db(query)
    new_data = []
    for single in data:
        # get owner profile info
        query2 = 'SELECT account_name FROM users WHERE id=%d'%(int(single['prop_owner']))
        res = db_toolkit.query_db(query2)
        # get property pictures
        query3 = 'SELECT filename FROM images WHERE post_id=%d'%(single['id'])
        res2 = db_toolkit.query_db(query3)
        n_single = single
        n_single.update({'owner':res[0]})
        n_single.update({'images':res2})
        new_data.append(n_single)
    return {'status':'ok', 'data':new_data}        


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
