from django.shortcuts import render, redirect
from .models import Information, Contact
from django.contrib import messages
from .forms import ContactForm

def home_view(request):
    information = Information.objects.first()

    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "پیام شما با موفقیت ارسال شد")
            return redirect('home')
    else:
        form = ContactForm()

    return render(request, 'home.html', {'form': form, 'information': information})

def about_view(request):
    return render(request, "about.html")