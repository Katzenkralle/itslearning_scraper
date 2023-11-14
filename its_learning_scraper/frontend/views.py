from django.shortcuts import render
from django.contrib import messages
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import HttpResponse
from rest_framework import status

#from .models import profile
# Create your views here.
def home(request, *args, **kwargs):
    return render(request, "index.html")
    #sub_title Fungirt aktuell mehr all all_contetn

def login(request):    
    return render(request, 'index.html')