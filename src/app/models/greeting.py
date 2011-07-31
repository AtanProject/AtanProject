from google.appengine.ext import db

class Greeting(db.Model):
    """Models an individual Guestbook entry with an author, content, and date."""
    author = db.UserProperty()
    content = db.StringProperty(multiline=True)
    date = db.DateTimeProperty(auto_now_add=True)
