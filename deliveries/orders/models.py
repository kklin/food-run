from django.db import models

class FoodRun(models.Model):
    poor_intern = models.CharField(max_length=30)
    created = models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    orderer = models.CharField(max_length=30)
    name = models.CharField(max_length=20)
    quantity = models.IntegerField(default=0)
    foodRun = models.ForeignKey(FoodRun)

    def __str__(self):
        return self.orderer + " wants " + str(self.quantity) + ": " + self.name

    # for json serialization
    def to_dict(self):
        return {'orderer': str(self.orderer),
                'name': str(self.name),
                'quantity': int(self.quantity),
                'food_run_id': int(self.foodRun.id)}
