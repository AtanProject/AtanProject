from google.appengine.ext import db

class Word(db.Model):
    spelling = db.StringProperty()
    meaning = db.StringProperty()

class WordList(db.Model):
    name = db.StringProperty()
    owner = db.UserProperty()

class WordMember(db.Model):
    wordlist = db.ReferenceProperty(WordList, collection_name='words')
    word = db.ReferenceProperty(Word)
