from django.conf.urls import patterns, url

from orders import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^([0-9]+)', views.food_run, name='food_run'),
    url(r'^food_run/([0-9]+)', views.food_run_json, name='food_run_json'),
    url(r'^request_food', views.request_food, name='request_food'),
    url(r'^new_food_run', views.new_food_run, name='new_food_run'),
)
