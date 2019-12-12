import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

const url = 'https://restcountries.eu/rest/v2/all?fields=name;alpha3Code';

class App extends Component {
    state = {
        countries: [],
        info: [],
        borders: null,
        borderStates: null,
    };

    componentDidMount() {
        axios.get(url).then(response => {
            this.setState({countries: response.data});
        }).catch(error => {
            console.log(error);
        })
    };

    getCountryDetails = (event) => {
        axios.get('https://restcountries.eu/rest/v2/alpha/' + event).then(response => {
            this.setState({info: response.data, borders:response.data.borders});
        }).then(()=> {
            this._getBorderingCountry(this.state.borders);
        });
    };

    _getBorderingCountry (borders) {
        if (borders.length > 0) {
            let arr = [];
            for (let i = 0; i < borders.length; i++) {
                axios.get('https://restcountries.eu/rest/v2/alpha/' + borders[i]).then(response => {
                    arr.push(response.data.name);
                })
            }
            this.setState({borderStates:arr});
        }
    };

    render() {
        const country = this.state.info;

        return (
            <div className="Interface">
                <div className="Country-List">
                    <h2>Countries: </h2>
                    <ul>
                        {this.state.countries.map((country,index)=>{
                            return <li key={country.alpha3Code}
                                       onClick={()=>this.getCountryDetails(country.alpha3Code)}
                            >
                                {country.name}
                            </li>
                        })}
                    </ul>
                </div>
                <div className="Country-Info">
                    <h3>Country Info</h3>
                    <h4>{country.name}</h4>
                    <p>Capital: {country.capital}</p>
                    <p>Region: {country.region}</p>
                    <p>Sub-region: {country.subregion}</p>
                    <p>Population: {country.population}</p>
                    <p>Area: {country.area}</p>
                    <img src={country.flag} alt="country.name"/>
                    <div>Borders with:
                        <ul>
                            {this.state.borderStates !== null ? this.state.borderStates.map(borderingState => (
                                <li>{borderingState.name}</li>
                            )) : null}
                        </ul>
                    </div>
                </div>
            </div>
        );
    };
}

export default App;