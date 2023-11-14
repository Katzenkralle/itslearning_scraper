import requests
from bs4 import BeautifulSoup as bs
import urllib.request
import datetime
import time
import json

def go_to_forms(s, url):
    #Go to /Project/AllProjects.aspx
    responce = s.get(url)
    soup = bs(responce.content, 'html.parser')

    table = soup.find(attrs={'id': 'itsl-groups-projects-heading'}).find_all_next('tr')
   

    projects = {}
    for row in table:
        if row.attrs['id'] != 'ctl29_0':
            cells = row.find_all('td')
            if cells:
                title = cells[1].find('a').text
                last_updated = cells[3].text
                status = cells[4].text
                href = cells[1].find('a')['href']
                projects[title] = {'title': title, 'last_updated': last_updated, 'status': status, 'href': f'https://hb.itslearning.com{href}'}
    return projects

def get_forms(s, url):
    #Go to Groups (overview)
    responce = s.get(url)
    soup = bs(responce.content, 'html.parser')
    resource_link = soup.find(id='link-resources')
    #Search for href an go to recource tab, benötiggt auffgrund von id
    responce = s.get(resource_link.get('href'))
    soup = bs(responce.content, 'html.parser')
    forum_table = soup.find_all('script', src=False)[0].string
    #Extrahire benötigte informationen aus tabelle
    json_start = forum_table.find('{')
    json_end = forum_table.rfind('}')
    json_data = forum_table[json_start:json_end+1]
    table_data = json.loads(json_data)
    data=[]
    try:
        for element in table_data['currentFolder']['folderElements']['elements']:
            title = element['title']
            release = element['publishedDate']
            href = element['elementUrl']
            data.append({'title': title, 'author': release, 'href': f'https://hb.itslearning.com{href}'})
        return data
    except:
        return


def get_posts(s, url):
    #Get Subject page
    responce = s.get(url)
    soup = bs(responce.content, 'html.parser')
    table = soup.find('table', attrs={'class': 'h-width-100'})

    posts = []
    for row in table:
        if row != '\n':
            cells = row.find_all(['td', 'th'])
            if len(cells) < 3:
                continue
            posts.append({
                'subject': cells[1].text,
                'start_date': cells[2].text,
                'latest': cells[3].text,
                'href': f"https://hb.itslearning.com{cells[1].find('a').get('href')}"
            })
    del posts[0]
    return posts


class Scraper():
    def __init__(self, usr = None, passwd = None, session = None) -> None:
        self.usr = usr
        self.passwd = passwd
        self.session = session
        #Get value of hidden field
        self.hidden_field = lambda field: bs((requests.get("https://hb.itslearning.com/index.aspx")).content, 'html.parser').find(attrs={'id': field})['value']

    def get_data(self, login = False):
        payload = {'__EVENTTARGET': "__Page",
                   '__EVENTARGUMENT': "NativeLoginButtonClicked",
                    '__VIEWSTATE': self.hidden_field('__VIEWSTATE'),
                    '__VIEWSTATEGENERATOR': "90059987",
                    '__EVENTVALIDATION': self.hidden_field('__EVENTVALIDATION'),
                    'ctl00$ContentPlaceHolder1$Username': self.usr,
                    'ctl00$ContentPlaceHolder1$Password': self.passwd,
                    'ctl00$ContentPlaceHolder1$ChromebookApp': 'false',
                    'ctl00$ContentPlaceHolder1$showNativeLoginValueField': ''}
        
        
        with requests.Session() as s:
            print(f'{(datetime.datetime.now() - datetime.timedelta(hours=1)).strftime("%a, %d %b %Y %H:%M:%S %Z")}GMT')
            #Login
            main_page = s.post('https://hb.itslearning.com/index.aspx', data=payload)
            if main_page.url == 'https://hb.itslearning.com/LoginError.aspx': #main_page.url == 'https://hb.itslearning.com/index.aspx'
                return 'login_err'
            
            if login is not True:
                projects = go_to_forms(s, 'https://hb.itslearning.com/Project/AllProjects.aspx')
                for project in projects:
                    projects[project]['ressourses'] = get_forms(s, projects[project]['href'])
                    if projects[project]['ressourses'] is None:
                        continue
                    for element in projects[project]['ressourses']:
                        element['post'] = get_posts(s, element['href'])
                
                return projects
            """
            [{Project [{Recource[{Posts}, {Post2}], Recource2[{Post1}]}]}, Project2..]
            """