FROM python:latest

#Copy App:
RUN mkdir /its_learning_scraper
COPY its_learning_scraper /its_learning_scraper

#Installing dependencys ||: for ignoring any errors
RUN apt-get update || : && apt install npm nginx cron -y

WORKDIR /its_learning_scraper/frontend
RUN npm i
RUN npm run build
WORKDIR /its_learning_scraper
RUN pip install -r requirements.txt

#Setup django
ENV RUN_IN_DEBUG="False"
RUN python3 manage.py makemigrations
RUN python3 manage.py migrate
RUN python3 manage.py collectstatic --noinput
#Setup Nginx
COPY nginx.conf /etc/nginx/nginx.conf
RUN chmod -R o+rx /ll_web/ && chmod -R o+rx /ll_web/frontend/ && chmod -R o+rx /ll_web/frontend/static/

#Start App
CMD ["bash","kickoff.sh"]