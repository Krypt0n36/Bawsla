import psycopg2


db = psycopg2.connect("host=ec2-3-218-71-191.compute-1.amazonaws.com dbname=d8tu31t0tgo1rt user=jissrduypdghng password=e023133de99ce95a9a901bee57854b91c6f23089bf2025ff8fd7ccd84e04e790")




def query_db(query, args=(), one=False):
    cur = db.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv   


def post_db(query, ret=False):
    cur = db.cursor()
    cur.execute(query)
    db.commit() 
    if ret:
        return cur.lastrowid
    else:
        return None

query = '''
SELECT COUNT(id) FROM users WHERE password_value="belani.hassen@gmail.com"
'''
print(query_db(query))
print('DONE')
db.close()
