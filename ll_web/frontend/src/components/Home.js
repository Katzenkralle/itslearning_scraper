import React, { useEffect, useState } from 'react';
import { filterData, gridTree } from './UiElements';

function HomePage() {
    const [topLvlContent, setTopLvlContent] = useState([]);
    const [bottomLvlContent, setBottomLvlContent] = useState([]);
    const [entrys, setEntrys] = useState([]);
    const [allData, setAllData] = useState([]);
    const [selectedTopValue, setSelectedTopValue] = useState('All');
    const [selectedBottomValue, setSelectedBottomValue] = useState('All');
    const [filteredData, setFilteredData] = useState([]);
    const [searchString, setSearchString] = useState('');


    function filterDataByTitle(data, searchString) {
        let result;
        let filteredPost = [];
        let filteredRessources = [];

        searchString = searchString.toLowerCase();

        if (data.title.toLowerCase().includes(searchString)) {
            return data;
        }

        data.ressourses.forEach(element => {
            if (element.hasOwnProperty('post')) {
                const posts = element.post.filter(post => post.subject.toLowerCase().includes(searchString));
                posts.length > 0 ? filteredPost.push([posts, element]) : null;
            }
            if (element.title.toLowerCase().includes(searchString)) {
                filteredRessources.push(element);
            }
        });
        if (filteredRessources.length > 0 || filteredPost.length > 0) {
            result = {
                title: data.title,
                last_updated: data.last_updated,
                href: data.href,
                ressourses: filteredRessources
            };
        } else {
            return null;
        }
        filteredPost.forEach(element => {
            if (!filteredRessources.includes(element[1])) {
                result.ressourses.push(element[1])
                //result.ressourses[result.ressourses.length -1].post = element[0]
            }
            result.ressourses.map(ressource => {
                if (ressource == element[1]) {
                    ressource.post = element[0]
                }
            }
            )
        })
        return result;
    }

    useEffect(() => {
        //get data from backend on page load
        fetchData();
    }, []);

    useEffect(() => {
        //Filter Data by selected values
        setFilteredData([]);
        var newData = []
        for (const key in allData) {
            if (selectedTopValue === 'All' || key === selectedTopValue) {
                newData.push(JSON.parse(JSON.stringify(allData[key])))
                //newData[newData.length -1]["ressourses"] = []
            }
            else {
                continue
            }
            let current = newData[newData.length - 1]
            for (let element in current.ressourses) {
                if (selectedBottomValue === 'All' || current.ressourses[element].title === selectedBottomValue) {
                    continue
                } else {
                    delete current.ressourses[element]
                }
            }
        }

        const searchData = [];
        if (searchString !== '') {
            // Iterate through each item in newData and filter by title
            for (const item of newData) {
                const matchingTitles = filterDataByTitle(item, searchString);
                // Add the matching titles along with their paths to searchData
                matchingTitles != null ? searchData.push(matchingTitles) : null;
            }
            newData = searchData;
        }
        setFilteredData(newData);
    }, [selectedTopValue, allData, selectedBottomValue, searchString]);

    const postAction = (action) => {
        const formData = new FormData();
        formData.append('csrfmiddlewaretoken', document.getElementsByName('csrfmiddlewaretoken')[0].value);
        formData.append('action', action);
        fetch('api/viewContent/', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                fetchData();
            })
            .catch(error => console.error('Error:', error));
    };

    const fetchData = () => {
        fetch('api/viewContent/')
            .then(response => {
                if (!response.ok) {
                    window.location.href = '/login'
                }
                return response.json()
            })
            .then(data => {

                // Update the state using the setter functions
                setBottomLvlContent(data.bottomLvl);
                setTopLvlContent(data.topLvl);
                setEntrys(data.entrys);
                setAllData(data.allData);
            })
            .catch(error => console.error('Error:', error));
    };


    return (
        <div className='flex'>
            <main className='flex flex-col max-w-[1624px] mx-auto p-2'>
                <div className='flex flex-wrap'>
                    <button className="inputElement" onClick={() => {setAllData([]); postAction("clear")}}>Re-fetch Data</button>
                    <button className='inputElement ml-auto' onClick={() => postAction('logout')}>Clear Session</button>
                </div>
                <h1 className='mainHl mx-auto mb-3'>ItsLearning Forum Scraper</h1>
               
                {filterData(topLvlContent, selectedTopValue, bottomLvlContent,
                            setSelectedTopValue, setSelectedBottomValue, setSearchString)}

                {allData.length == 0 ? (
                    <div id="loadingPing" className='loadingPing w-[20px] mt-2 h-[20px] rounded-full bg-error mx-auto'/>
                ) : (
                <div className='border-x border-b border-1 border-border'>
                    {filteredData.length == 0 ? (
                        <div className='bg-bg2 border-t border-1 border-border'>
                            <h3 className='infoHl'>No results found</h3>
                            <p>Either you are not in any posts, or the applied filter does not match any posts.</p>
                        </div>
                    ) : null}

                    {gridTree(filteredData)}
                </div>
                )}
            </main>
        </div>
    );
}

export default HomePage;
