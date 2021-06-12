import random
import string
import db_toolkit
from PIL import Image

def sendVerifEmail(email_address, code):
    print("======================")
    print("to email : " + email_address)
    print(code)
    print("======================")


def sendVerifPhone(phone_number, code):
    print("======================")
    print("to phone : " + phone_number)
    print(code)
    print("======================")


def checkSessionToken(identifier, session_token):
    query = 'SELECT id FROM users WHERE id=%s AND session_token="%s"'%(int(identifier), session_token)
    data = db_toolkit.query_db(query)
    if(len(data) > 0):
        return True
    else:
        return False


def convertImage(filename, fnwe):
    filepath = 'static/temp/'+filename
    im = Image.open(filepath)
    cim = im.convert('RGB')
    cim.save('static/avatars/'+fnwe+'.jpg')

    