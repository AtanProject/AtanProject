from os.path import dirname, join

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.api import users
from app.models.word import Word, WordList, WordMember

class Words(webapp.RequestHandler):
    def get(self):
        wordlists = WordList.all().filter('owner =', users.get_current_user())

        wordlist_key = self.request.get('wordlist_key')
        if wordlist_key:
            wordlist = WordList.get(wordlist_key)
        else:
            wordlist = wordlists and wordlists.get()

        # FIXME: an exception will be thrown if the user has no wordlists
        template_values = {'words': wordlist.words, 'wordlists': wordlists, 'wordlist_name': wordlist.name}

        path = join(dirname(dirname(dirname(__file__))), 'template', 'words.html')
        self.response.out.write(template.render(path,template_values))

    def post(self):
        content = self.request.get('content')
        for line in content.split('\n'):
            spelling, meaning = line.split(',')

            word = Word()
            word.spelling = spelling
            word.meaning = meaning

            word.put()

        self.redirect('/words')
