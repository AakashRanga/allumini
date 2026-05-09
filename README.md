# Project Setup Guide

## Frontend Setup

### Start Frontend Server

```bash
npm install
npm run dev
```

### Frontend Port

```text
http://localhost:7777
```

### Required Files

Add the following files to the frontend project root:

1. `firebase.json`
2. `serviceAccountKey.json`

---

# Backend Setup

### Create Virtual Environment

```bash
# Linux / macOS
python -m venv venv

# Windows (Python 3.11)
py -3.11 -m venv venv
```

### Activate Virtual Environment

```bash
# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate
```

### Start Backend Server

```bash
python app.py
```

### Required Files

Add the following files to the backend project root:

1. `credentials.json`
2. `token.json`

---

# Recommended `.gitignore`

```gitignore
# Node Modules
node_modules/

# Python Virtual Environment
venv/

# Secret Files
credentials.json
token.json
serviceAccountKey.json
firebase.json

# Cache Files
__pycache__/
*.pyc

# Environment Files
.env
```
