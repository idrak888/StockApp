import React from 'react';

const SearchResults = props => {
    return (
        <div className="SearchResults">
            <ul>
                {props.searchResults.map((res, index) => {
                    return (
                        <p onClick={() => props.selectSearch(res["1. symbol"])} key={index}>
                            {res["1. symbol"]} 
                            <span className="name">
                                ({res["2. name"]})
                            </span>
                        </p>
                    )
                })}
            </ul>
        </div>
    )
}   

export default SearchResults;