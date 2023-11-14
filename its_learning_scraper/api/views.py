from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User

from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import redirect

import json
from .scraper import Scraper
from .search import search_data

def load_data_to_session(session):
        try: #Write to function
            session['data'] = Scraper(usr = session['user'], passwd = session['passwd']).get_data()
            if session['data'] == 'login_err':
                raise Exception 
            session['auth'] = True  #Session auth currently unused
            return True
        except Exception:
            #Catch all exceptions becaue it must accound for errors during scraping
            session['auth'] = False
            return False

class UserView(APIView):
    def get(self, request):
        session = request.session
        if session.get("data", []) == []:
            if not load_data_to_session(session):
                return HttpResponse(status=status.HTTP_403_FORBIDDEN)

        top_level, bottom_level, entry, search_results = search_data(session["data"], "") # search results handeled in frontend
        return JsonResponse({"bottomLvl": bottom_level, "topLvl": top_level, "entrys": entry, "allData": session["data"]}, safe=False)

    def post(self, request):
        session = request.session
        action = request.POST.get("action", "")
        
        match action:
            case "clear":
                session["data"] = []
                return HttpResponse(status=status.HTTP_200_OK)
            case "logout":
                session.clear()
                return HttpResponse(status=status.HTTP_200_OK)
            case _: return HttpResponse(status=status.HTTP_403_FORBIDDEN)

def login(request):
    session = request.session
    session.clear()
    session['user'] = request.POST.get('user')
    session['passwd'] = request.POST.get('passwd')

    
    if not load_data_to_session(session):
        return HttpResponse(status=status.HTTP_403_FORBIDDEN)
    else:
        return HttpResponse(status=status.HTTP_202_ACCEPTED)