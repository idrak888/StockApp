import React from 'react';
import axios from 'axios';
import Chart from './Chart';
import SearchResults from './SearchResults';

class Dashboard extends React.Component {
    state = {
        metaData: {},
        timeSeries: [],
        loaded: false,
        quote: {},
        searchKeywords: '',
        searchResults: []
    }
    apikey = '';
    mainCall = symbol => {
        const loader = document.querySelector('.loader');
        document.querySelector('#top-form').scrollIntoView();

        this.setState({loaded: false})
        loader.style.display = 'block';

        axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${this.apikey}}`)
        .then(doc => {
            this.setState({
                metaData:doc.data["Meta Data"], 
                timeSeries:doc.data["Time Series (Daily)"]
            }, () => {
                axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apikey}}`)
                .then (doc2 => {
                    this.setState({quote: doc2.data["Global Quote"]}, 
                        () => {
                            if (this.state.quote) {
                                this.setState({loaded:true}, () => {
                                    loader.style.display = 'none';

                                    const price = document.querySelector('.price');
                                    console.log(this.state.metaData);
        
                                    if (this.state.quote["09. change"] < 0) {
                                        price.classList.add('red'); 
                                        price.classList.remove('green');
                                    } else {
                                        price.classList.add('green');
                                        price.classList.remove('red');
                                    }
                                });
                            }
                        }
                    );
                });
            });
        }).catch(e => {
            console.log(e);
        });   
    } 
    componentDidMount () {
        this.mainCall('AMD');
    }
    handleSearch = e => {
        this.setState({searchKeywords:e.target.value});
    }
    showResults = e => {
        e.preventDefault();
        if (this.state.searchKeywords.length > 1) {
            axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${this.state.searchKeywords}&apikey=${this.apikey}}`)
            .then(doc => {
                this.setState({searchResults:doc.data.bestMatches});
                document.querySelector('.SearchResults').style.display = 'block';
                document.querySelector('#searchResults').scrollIntoView();
            });
        }
    }
    render () {
        return (
            <div className="Dashboard">
                <form id="top-form" onSubmit={this.showResults}>
                    <input onChange={this.handleSearch} type="text" placeholder="Search equities"/>
                </form>
                <img src="https://flevix.com/wp-content/uploads/2019/07/Ring-Preloader.gif" className="loader"/>
                {( (this.state.loaded) && this.state.quote ? 
                    <div className="container">
                        <div className="data left">
                            <span className="symbol">{this.state.quote["01. symbol"]}</span>
                            <br/>
                            <span className="price">${this.state.quote["05. price"]}</span>
                        </div>
                        <div className="data right">
                            <p>Day range: {this.state.quote["04. low"]}-{this.state.quote["03. high"]}</p>
                            <p>Volume: {this.state.quote["06. volume"]}</p>
                            <p>% Change: {this.state.quote["10. change percent"]}</p>
                        </div>
                        <Chart timeSeries={this.state.timeSeries}/>
                        <h3>{this.state.metaData["1. Information"]}</h3>
                        <p>{this.state.metaData["3. Last Refreshed"]}</p>
                        <br/>
                        <h2 id="searchResults">Search results</h2>
                        <SearchResults selectSearch={this.mainCall} searchResults={this.state.searchResults}/>
                    </div>
                : 'loading')}
            </div>
        )
    }
}

export default Dashboard;
