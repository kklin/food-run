# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_auto_20150303_2243'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='foodRun',
        ),
        migrations.DeleteModel(
            name='FoodRun',
        ),
        migrations.AddField(
            model_name='order',
            name='foodRunId',
            field=models.IntegerField(default=None),
            preserve_default=False,
        ),
    ]
