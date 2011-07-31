from os.path import dirname, join

from app.models.greeting import Greeting
from app.utils.utils import guestbook_key
from google.appengine.ext.webapp import template
from google.appengine.api import users
from google.appengine.ext import webapp

class MainPage(webapp.RequestHandler):
    def get(self):
        guestbook_name=self.request.get('guestbook_name')
        greetings_query = Greeting.all().ancestor(
            guestbook_key(guestbook_name)).order('-date')
        greetings = greetings_query.fetch(10)

        if users.get_current_user():
            url = users.create_logout_url(self.request.uri)
            url_linktext = 'Logout'
        else:
            url = users.create_login_url(self.request.uri)
            url_linktext = 'Login'

        template_values = {
            'greetings': greetings,
            'url': url,
            'url_linktext': url_linktext,
        }

        path = join(dirname(dirname(dirname(__file__))), 'template', 'index.html')
        self.response.out.write(template.render(path, template_values))
