import json
from gc import get_objects
from urllib import request
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from trainees.models import Trainee


def index(request):
    return render(request, "gym/index.html")

def trainees(request):
    message = ""
    didAdd = False
    if request.method == "POST":
        name = request.POST.get("name", "").strip()
        score = request.POST.get("score", "").strip()
        comments = request.POST.get("comments", "").strip()

        if not name.replace(" ", "").isalpha():
            message = "Name should only contain letters."
        elif not score.isdigit() or not (1 <= int(score) <= 10):
            message = "Score must be a number between 1 and 10"
        elif Trainee.objects.filter(name=name).exists():
            message = "This trainee already exists"
        else:
            didAdd = True
            Trainee.objects.create(name=name, score=int(score), comments=comments)
            message = f"Trainee {name} successfully added!"

    return render(request, "gym/trainees.html", {
        "message": message,
        "didAdd" : didAdd})