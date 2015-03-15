# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0004_auto_20150303_2248'),
    ]

    operations = [
        migrations.CreateModel(
            name='FoodRun',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('poor_intern', models.CharField(max_length=30)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='order',
            name='foodRunId',
        ),
        migrations.AddField(
            model_name='order',
            name='foodRun',
            field=models.ForeignKey(default=None, to='orders.FoodRun'),
            preserve_default=False,
        ),
    ]
