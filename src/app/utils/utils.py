from google.appengine.ext import db

def guestbook_key(guestbook_name=None):
    """Constructs a datastore key for a Guestbook entity with guestbook_name."""
    return db.Key.from_path('Guestbook', guestbook_name or 'default_guestbook')
