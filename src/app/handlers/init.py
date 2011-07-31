# -*- coding: utf-8 -*-

from os.path import dirname, join
from random import shuffle, choice
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.api import users
from app.models.word import Word, WordList, WordMember

wordlists = [[("restrain", u"抑制する"), \
              ("accompany", u"～を伴う"), \
              ("facilitate", u"～を手伝う"), \
              ("thoughtful", u"思いやりのある"), \
              ("relevant", u"関連のある"), \
              ("convincing", u"説得力のある"), \
              ("applicant", u"志願者"), \
              ("anchor", u"停泊する"), \
              ("prevalent", u"普及している"), \
              ("candidate", u"候補")], \
             [("inquiry", u"問い合わせる"), \
              ("defect", u"欠陥"), \
              ("consider", u"熟考する"), \
              ("moor", u"停泊する"), \
              ("stroll", u"ぶらつく"), \
              ("applaud", u"～に拍手を送る"), \
              ("misplace", u"置き忘れる"), \
              ("mandate", u"権限"), \
              ("waive", u"～を免除する"), \
              ("prohibit", u"禁止する")], \
             [("persuade", u"～を説得する"), \
              ("pharmacy", u"薬局"), \
              ("merchandise", u"商品"), \
              ("regulation", u"規則"), \
              ("urgent", u"緊急の"), \
              ("infer", u"知る"), \
              ("transport", u"～を輸送する"), \
              ("guarantee", u"～を保証する"), \
              ("accountant", u"会計士"), \
              ("account", u"講座")], \
             [("in terms of", u"～という点で"), \
              ("ring off", u"電話を切る"), \
              ("hang up", u"電話を切る"), \
              ("side by side", u"並んで"), \
              ("parallel park", u"縦列駐車"), \
              ("assign", u"～を任命する"), \
              ("resign", u"～辞職する"), \
              ("establish", u"～を設立する"), \
              ("restructure", u"～を再編成する"), \
              ("implement", u"～を施行する")], \
             [("exception", u"例外"), \
              ("indication", u"兆し"), \
              ("permission", u"許可"), \
              ("violation", u"違反"), \
              ("opposition", u"反対"), \
              ("stability", u"安定"), \
              ("outcome", u"結果"), \
              ("patient", u"患者"), \
              ("specifications", u"仕様書"), \
              ("enlarge", u"広がる")]]

class Init(webapp.RequestHandler):
    def get(self):
        i = 0
        for wordlist in wordlists:
            wl = WordList(name="wordlist%02d" % i, owner=users.get_current_user())
            wl.put()
            for spelling, meaning in wordlist:
                w = Word(spelling=spelling, meaning=meaning)
                w.put()
                m = WordMember(wordlist=wl, word=w)
                m.put()
            i += 1
            
        self.redirect('/words')
