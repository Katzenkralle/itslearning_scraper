from django.urls import path
from .views import UserView, login

urlpatterns = [
    path("viewContent/", UserView.as_view(), name='data_collector'),
    path("login/", login, name="login")
]
