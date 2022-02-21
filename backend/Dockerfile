FROM python:3.9

WORKDIR /app

COPY ./backend/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY ./backend /app/backend

ENV PYTHONPATH "${PYTHONPATH}:/app/backend"

RUN python backend/db_setup.py

CMD ["uvicorn", "backend.backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
