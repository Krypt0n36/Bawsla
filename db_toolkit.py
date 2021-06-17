import json
import psycopg2
import psycopg2.extras

from flask import g

DATABASE = "host=ec2-3-218-71-191.compute-1.amazonaws.com dbname=d8tu31t0tgo1rt user=jissrduypdghng password=e023133de99ce95a9a901bee57854b91c6f23089bf2025ff8fd7ccd84e04e790"


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = psycopg2.connect(DATABASE)
    #db.row_factory = make_dicts
    return db
'''
def query_db(query, args=(), one=False):
    query = query.replace('"', "'")
    print("=========================")
    print(query)
    print("=========================") 
    db = get_db()
    cur = db.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    print("=========================")
    print(rv)
    print("=========================")
    #rv = [json.dumps(dict(record)) for record in cur] 
   
    dict_result = []
    for row in rv:
        dict_result.append(dict(row))
    cur.close()

    return dict_result
    #return (rv[0] if rv else None) if one else rv   
'''
def query_db(query, args=(), one=False):
    query = query.replace('"', "'")
    db = get_db()
    print("=========================")
    print(query)
    print("=========================") 
    cur = db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute(query)
    ans =cur.fetchall()
    dict_result = []
    for row in ans:
        dict_result.append(dict(row))
    return dict_result

def post_db(query, ret=False):
    query = query.replace('"', "'")
    db = get_db()
    print("=========================")
    print(query)
    print("=========================") 
    cur = db.cursor()
    cur.execute(query)
    db.commit() 
    if ret:
        return cur.fetchone()[0]
    else:
        return None


def make_dicts(cursor, row):
    return dict((cursor.description[idx][0], value)
                for idx, value in enumerate(row))


