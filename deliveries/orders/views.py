from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from orders.models import Order, FoodRun
import json

def index(request):
    return render(request, 'orders/index.html')

def food_run(request, food_run_id):
    # query db for food_run_items
    foodRun = FoodRun.objects.get(id=int(food_run_id))
    context = {'created' : foodRun.created, # TODO: convert to LA timezone
               'intern' : foodRun.poor_intern,
               'food_run_id' : food_run_id}
    return render(request, 'orders/food_run.html', context)

def food_run_json(request, food_run_id):
    # query db for food_run_items
    foodRun = FoodRun.objects.get(id=int(food_run_id))
    orders = foodRun.order_set.all()
    return JsonResponse(json.dumps(map(lambda x: x.to_dict(), orders)),
            safe=False)

# TODO: this would be better of as an API endpoint that returned the new URL,
# instead of redirecting
# TODO: use csrf
@csrf_exempt
def new_food_run(request):
    if request.method == 'POST':
        intern = request.POST['intern']
        foodRun = FoodRun(poor_intern = intern)
        foodRun.save()
        return redirect('food_run', foodRun.id)

# TODO: use csrf
@csrf_exempt
def request_food(request):
    if request.method == 'POST':
        orderer = request.POST['orderer']
        name = request.POST['name']
        quantity = int(request.POST['quantity'])
        food_run_id = int(request.POST['food_run_id'])
        foodRun = foodRun = FoodRun.objects.get(id=food_run_id)

        order = Order(orderer=orderer, name=name, quantity=quantity,
                foodRun=foodRun)
        order.save()
        return JsonResponse(order.to_dict());
