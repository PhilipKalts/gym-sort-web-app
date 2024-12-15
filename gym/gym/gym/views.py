import json
from gc import get_objects
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout


def index(request):
    return render(request, "gym/index.html")
