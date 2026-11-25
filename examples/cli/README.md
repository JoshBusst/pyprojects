# My Project

A Python CLI application, installable into your Python environment.

## Requirements

* Python 3.11+

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

Create and activate a virtual environment:

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Linux/macOS:

```bash
source .venv/bin/activate
```

Install the project:

```bash
pip install -e <project-directory>
```

## Usage

```bash
helloWorld
header NEWHEADER
math add 5 5
math divide 100 5
```

## Development

Install development dependencies:

```bash
pip install -r requirements.txt
```

## Project Structure

```text
.
├── pyproject.toml
├── README.md
├── LICENSE
├── .gitignore
├── requirements.txt
├── src/
│   └── project/
│       ├── __init__.py
│       └── cli.py
└── tests/
```

## License

This project is licensed under the terms of the license included in this repository.
