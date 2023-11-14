FROM python:latest

#Copy App:
RUN mkdir /its_learning_scraper
COPY its_learning_scraper /its_learning_scraper
COPY kickoff.sh /kickoff.sh

#Installing dependencys ||: for ignoring any errors
RUN apt-get update || : && apt install npm nginx cron -y

#Setup frontend
WORKDIR /its_learning_scraper/frontend
RUN npm i
RUN npm run build

WORKDIR /
RUN mkdir its_learning_scraper/data
RUN pip install -r its_learning_scraper/requirements.txt

#Setup django
ENV RUN_IN_DEBUG="True"
ENV SECRET_KEY="ONLYFORBUILDING"
RUN python3 its_learning_scraper/manage.py makemigrations
RUN python3 its_learning_scraper/manage.py migrate
RUN python3 its_learning_scraper/manage.py collectstatic --noinput
#Setup Nginx
COPY nginx.conf /etc/nginx/nginx.conf
RUN chmod -R o+rx /its_learning_scraper/ && chmod -R o+rx /its_learning_scraper/frontend/ && chmod -R o+rx /its_learning_scraper/frontend/static/

#Start App
CMD ["bash","kickoff.sh"]