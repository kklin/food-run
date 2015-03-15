# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_auto_20150303_2218'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='item',
            name='order',
        ),
        migrations.DeleteModel(
            name='Item',
        ),
        migrations.AddField(
            model_name='order',
            name='name',
            field=models.CharField(default=None, max_length=20),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='order',
            name='quantity',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
    ]
