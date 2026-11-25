
import click



@click.command
def helloWorld():
    """Print helloWorld to the console."""
    click.echo("helloWorld")

@click.command
@click.argument('title', default="<*>", type=str)
def header(title: str):
    spacer: str = "-" * 10
    click.echo(f"{spacer} {title} {spacer}")



# ---------- MATH ----------

@click.group
def math():
    click.echo("Coming in from math")

@math.command
@click.argument('a', type=float)
@click.argument('b', type=float)
def add(a, b) -> int:
    click.echo(a + b)

@math.command
@click.argument('a', type=float)
@click.argument('b', type=float)
def subtract(a, b) -> int:
    click.echo(a - b)

@math.command
@click.argument('a', type=float)
@click.argument('b', type=float)
def multiply(a, b) -> int:
    click.echo(a * b)

@math.command
@click.argument('a', type=float)
@click.argument('b', type=float)
def divide(a, b) -> int:
    click.echo(a / b)