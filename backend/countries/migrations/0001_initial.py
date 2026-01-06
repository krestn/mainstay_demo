# Generated manually to keep the exercise self-contained.
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="SelectedCountry",
            fields=[
                ("code", models.CharField(max_length=3, primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=128)),
                ("flag_url", models.URLField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["name"]},
        ),
    ]
