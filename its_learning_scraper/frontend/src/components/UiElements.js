import React, { useState } from "react";

export function filterData(topLvlContent, selectedTopValue, bottomLvlContent, setSelectedTopValue, setSelectedBottomValue, setSearchString) {
    return (
        <div className='flex flex-wrap justify-center mb-2'>
            <select className='inputElement'
                id='select_lvl_top'
                onChange={() => { setSelectedTopValue(document.getElementById("select_lvl_top").value); setSelectedBottomValue("All") }}>
                <option value="All">All</option>
                {topLvlContent.map(element => (
                    <option value={element}>{element}</option>
                ))}
            </select>
            <select className='inputElement mx-2'
                id='select_lvl_bottom'
                onChange={() => { setSelectedBottomValue(document.getElementById("select_lvl_bottom").value) }}>
                <option value="All">All</option>
                {bottomLvlContent.map(element => (
                    element[1] == selectedTopValue || selectedTopValue == 'All' ?
                        <option value={element[0]}>{element[0]}</option>
                        : null
                ))}
            </select>
            <input className='inputElement'
                type='text'
                placeholder='Search...'
                id='search' defaultValue={""}
                onChange={(e) => setSearchString(e.target.value)} />
        </div>
    )
}

export function gridTree(filteredData) {
    return (
        <>
            {filteredData.map(element => (
                <div className="grid grid-cols-3 border-t border-t-2 border-t-border bg-bg2">
                <div className="col-start-1 infoHl bg-accent flex"><h2>{element.title}</h2></div>
                <div className="col-start-2 bg-accent flex px-1"><p>{element.last_updated}</p></div>
                <div className="col-start-3 bg-accent flex"><a className='link' href={element.href}>Link</a></div>
               
                {element.ressourses.map(sup_element => {
                    return (
                        <section className="col-start-1 col-end-3">
                            <div className="grid grid-cols-4">
                                <div className="col-start-1 bg-accent2 flex"><p>{sup_element.title}</p></div>
                                <div className="col-start-2 bg-accent2 flex px-1"><p>{sup_element.author}</p></div>
                                <div className="col-start-3 bg-accent2 flex"><a className='link' href={sup_element.href}>Link</a></div>
                                <img className='col-start-4' src='../../static/arrow-left.png' />
                                {sup_element.post.map(post => {
                                    return (
                                        <section className="col-start-1 col-end-4">
                                            <div className="grid grid-cols-4">
                                                <div className="col-start-1 bg-accent3 flex"><p>{post.subject}</p></div>
                                                <div className="col-start-2 bg-accent3 flex px-1"><p>{post.latest}</p></div>
                                                <div className="col-start-3 bg-accent3 flex"><a className='link' href={post.href}>Link</a></div>
                                                <img className='col-start-4' src='../../static/arrow-left.png' />
                                            </div>
                                        </section>
                                    )
                                })}
                            </div>
                        </section>
                    )
                })}
            </div>
            ))}
        </>
    );
}
