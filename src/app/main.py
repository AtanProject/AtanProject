from app.handlers.main_page import MainPage
from app.handlers.guestbook import Guestbook
from app.handlers.words import Words
from app.handlers.init import Init
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

application = webapp.WSGIApplication([('/', MainPage),
                                      ('/init', Init),
                                      ('/sign', Guestbook),
                                      ('/words', Words)
                                      ],
                                     debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
