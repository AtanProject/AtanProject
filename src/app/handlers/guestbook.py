import urllib

from app.models.greeting import Greeting
from app.utils.utils import guestbook_key
from google.appengine.api import users
from google.appengine.ext import webapp

class Guestbook(webapp.RequestHandler):
    def post(self):
        guestbook_name = self.request.get('guestbook_name')
        greeting = Greeting(parent=guestbook_key(guestbook_name))

        if users.get_current_user():
            greeting.author = users.get_current_user()

        greeting.content = self.request.get('content')
        greeting.put()
        self.redirect('/?' + urllib.urlencode({'guestbook_name': guestbook_name}))
