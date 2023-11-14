# Itslearning Project scraper
### Note: 
- The Scraper my brake when Itslearning changes the Frontend.
- The Scraper was not tested on Accounts with many Projects, so turn the page to display more Projects is untested.
- The Scraper should be replaced with an api as soon as one becomes available.

### What it dose
1. The frontend gets the Itslearning Account information from the user
1. Using this, Django calls the Web Scraper to fetch all Projects, Resources in the Project and Discussion within the Resources
1. The backend dos does not save anything long-term. Temporary cashing of user data and fetch Projects is done on a session-by-session base
1. The fetch data is then served back to the frontend, where it can be viewed and filtered.

### How to install
- Clone the repository on your local machine.
- Run docker build (docerfile included in the repository)
- Start the container a port forward to 80 in the container.
- When run in production following environmental variables should be set: ALLOWED_HOSTS (IPv4 separated by ;), SECRET_KEY (str), RUN_IN_DEBUG ("1"/"0"), CSRF_TRUSTED_ORIGINS (IPv4 separated by ;)

### Use in Dev environment
- Install dependencies (requirements.txt in  `its_learning_scraper/` and npm pacages in `its_learning_scraper/frontend`)
- Run in Debug using preconfigured variables in `.vscode/launch.json`

### Used Stack:
#### Backend:
- Django, django-rest-framework 
- bs4, request (for the Scraper)

#### Frontend:
- React
