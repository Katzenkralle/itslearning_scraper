def search_data(data, search_string):
    top_level, bottom_level, entry = [], [], []
    result = []
    for item in data:
        top_level.append(item)
        if search_string in item:
            result.append((data[item]))
        
        if data[item]['ressourses']:
            for ressource in data[item]['ressourses']:
                bottom_level.append((ressource['title'], data[item]['title']))
                if search_string in ressource['title']:
                    result.append((ressource))

                if ressource['post']:
                    for post in ressource['post']:
                        entry.append(post['subject'])
                        if search_string in post['subject']:
                            result.append((post))
    if search_string == '':
        result = []
    return (top_level, bottom_level, entry, result)