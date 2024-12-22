import json
from gc import get_objects
from urllib import request
from django.shortcuts import redirect
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from trainees.models import Trainee
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt



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



def search_trainee(request):
    name = request.GET.get("name", "").strip()

    if not name:
        return JsonResponse({"success": False, "message": "No name provided."})

    trainees = Trainee.objects.filter(name__icontains=name)

    if trainees.exists():
        trainees_data = [
            {"name": trainee.name, "score": trainee.score, "comments": trainee.comments}
            for trainee in trainees]
        return JsonResponse({"success": True, "trainees": trainees_data})
    else:
        return JsonResponse({"success": False, "message": "No trainees found."})


@csrf_exempt
def edit_trainee(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Invalid request."})

    name = request.POST.get("name", "").strip()
    score = request.POST.get("score", "").strip()
    comments = request.POST.get("comments", "").strip()
    
    try:
        trainee = Trainee.objects.get(name__iexact=name)
        trainee.score = int(score)
        trainee.comments = comments
        trainee.save()
        return JsonResponse({"success": True, "message": "Trainee updated successfully!"})
    except Trainee.DoesNotExist:
        return JsonResponse({"success": False, "message": "Trainee not found."})


@csrf_exempt
def delete_trainee(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Invalid request."})

    name = request.POST.get("name", "").strip()

    try:
        trainee = Trainee.objects.get(name__iexact=name)
        trainee.delete()
        return JsonResponse({"success": True, "message": f"Trainee {name} deleted successfully!"})
    except Trainee.DoesNotExist:
        return JsonResponse({"success": False, "message": "Trainee not found."})