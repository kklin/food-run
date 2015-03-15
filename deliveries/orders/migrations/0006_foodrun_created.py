# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0005_auto_20150304_0059'),
    ]

    operations = [
        migrations.AddField(
            model_name='foodrun',
            name='created',
            field=models.DateTimeField(default=datetime.date(2015, 3, 15), auto_now_add=True),
            preserve_default=False,
        ),
    ]
