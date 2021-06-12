from flask import request
import string
import json



def filter(value, allowed_chars):
	if(allowed_chars == 'everything'):
		return True
	for c in value:
		if c not in allowed_chars:
			return False
			break
	return True

def getField(field_name, optional=False, allowed_chars=string.ascii_letters):
	try:
		value = request.values[field_name]
	except Exception as e:
		if(optional == True):
			return None
		value = ''
		
	if((len(value) == 0) and (optional==False)):
		raise Exception(field_name)
	if not filter(value, allowed_chars):
		raise Exception(field_name)
	return value


def getFieldValue(field_name, optional=False):
	try:
		value = request.values[field_name]
	except Exception as e:
		if(optional == True):
			return None
		raise Exception(str(e))
	return value


def getFieldJson(field_name, optional=False):
	try:
		value = request.values[field_name]
		json_value = json.loads(value)
	except Exception as e:
		if(optional == True):
			return None
		raise Exception(str(e))
	return json_value