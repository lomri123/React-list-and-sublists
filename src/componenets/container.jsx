import React, { Component } from "react";
import { Columns } from "./columns";
import SimpleMap from "./map";
import data from "../Sources/clients";
import Geocode from "react-geocode";
import { Headers } from "./headers";

//General info:
//1.receiving a JSON file with companies information. transforming it into an object structure - country {city {company}}
//2. setting default value to show to user when he opens a new screen
//3. re-render the country/city/company columns upon selection, and show selected copmany address on map

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objParsedComp: this.buildCompaniesList(),
      selected_country: "",
      selected_city: "",
      selected_company: "",
      Address: "",
      mapCoordinates: { lat: 0, lng: 0 }
    };
  }

  //after we initiated the buildCompaniesList function in the costructor, we now set the default values
  componentWillMount() {
    this.setDefaultValues();
  }

  //setting the default GPS coordinates
  async componentDidMount() {
    let defaultGeo = await this.getGeoCode(this.state.Address);
    this.setState({
      mapCoordinates: defaultGeo
    });
  }

  //function that accepts an address and returns GPS coordinates
  getGeoCode = address => {
    Geocode.setApiKey("AIzaSyCIBNLY0r4t9t63aRY1VZUTYE1YH0NCCKs");

    return Geocode.fromAddress(address).then(
      response => response.results[0].geometry.location
    );
  };

  //*1 - initiated in the constructor to transform the json file into a workable object/dictionary
  buildCompaniesList = () => {
    let obj = {};
    let sortedObj = {};
    let sortedObj1 = {};
    let sortedObj2 = {};

    for (let company of data.Customers) {
      if (!(company.Country in obj)) {
        obj[company.Country] = {};
      }
      if (!(company.City in obj[company.Country])) {
        obj[company.Country][company.City] = {};
      }
      obj[company.Country][company.City][company.CompanyName] = [];
      obj[company.Country][company.City][company.CompanyName].push(
        company.Address
      );
    }
    //sorting our object by country
    this.sortByNestedQuantity(obj).forEach(country => {
      sortedObj[country] = obj[country];
      //nested sort of the cities by name using the countries forEach function
      this.sortByNestedQuantity(sortedObj[country]).forEach(city => {
        sortedObj1[country] = obj[country];
        sortedObj1[country][city] = sortedObj[country][city];
        //nested sort of the companies by name using the cities forEach function
        Object.keys(sortedObj1[country][city])
          .sort()
          .forEach(company => {
            sortedObj2[country] = sortedObj1[country];
            sortedObj2[country][city] = sortedObj1[country][city];
            sortedObj2[country][city][company] =
              sortedObj1[country][city][company];
          });
      });
    });
    return sortedObj2;
  };
  //*2 - setting default values to selected_country, selected_city, selected_company and Address into the this.state
  setDefaultValues = () => {
    let defaultCountry = Object.keys(this.state.objParsedComp)[0];
    let defaultCity = Object.keys(this.state.objParsedComp[defaultCountry])[0];
    let defaultCompany = Object.keys(
      this.state.objParsedComp[defaultCountry][defaultCity]
    )[0];
    let defaultAddress = this.state.objParsedComp[defaultCountry][defaultCity][
      defaultCompany
    ];
    this.setState({
      selected_country: defaultCountry,
      selected_city: defaultCity,
      selected_company: defaultCompany,
      Address: `${defaultAddress} ${defaultCity} ${defaultCountry}`
    });
  };

  //function that accepts an object (data) and sorts its keys by the quantity of nested keys
  sortByNestedQuantity(data) {
    return Object.keys(data).sort(function(a, b) {
      const firstNested = Object.keys(data[a]).length;
      const secondNested = Object.keys(data[b]).length;
      return secondNested - firstNested;
    });
  }

  //handle onClick when user presses a country or city on the list (columns 1 + 2)
  handleClick = (value, stage) => {
    if (stage === "country") {
      let defaultCity = Object.keys(this.state.objParsedComp[value])[0];
      this.setState({ selected_city: defaultCity });
    }
    let stateChange = "selected_" + stage;
    this.setState({ [stateChange]: value });
  };
  //handle onClick when user presses a company on the list (column 3)
  handleCompanyClick = async value => {
    let street = this.state.objParsedComp[this.state.selected_country][
      this.state.selected_city
    ][value];
    let address = `${street} ${this.state.selected_city} ${
      this.state.selected_country
    }`;
    const mapCoordinates = await this.getGeoCode(address);
    this.setState({
      selected_company: value,
      mapCoordinates,
      Address: address
    });
  };
  //handles the render of the Country columns
  createCountryList() {
    return Object.keys(this.state.objParsedComp).map(country => (
      <li
        className={`list ${
          this.state.selected_country === country ? "list-selected" : ""
        }`}
        key={country}
        onClick={this.handleClick.bind(this, country, "country")}
        data-value={country}
      >
        {country}
      </li>
    ));
  }

  //handles the render of the city columns
  createCityList() {
    return Object.keys(
      this.state.objParsedComp[this.state.selected_country]
    ).map(city => (
      <li
        className={`list ${
          this.state.selected_city === city ? "list-selected" : ""
        }`}
        key={city}
        onClick={this.handleClick.bind(this, city, "city")}
        data-value={city}
      >
        {city}
      </li>
    ));
  }

  //handles the render of the company columns
  createCompanyList() {
    return Object.keys(
      this.state.objParsedComp[this.state.selected_country][
        this.state.selected_city
      ]
    ).map(company => (
      <li
        className={`list ${
          this.state.selected_company === company ? "list-selected" : ""
        }`}
        key={company}
        onClick={this.handleCompanyClick.bind(this, company)}
        data-value={company}
      >
        {company}
      </li>
    ));
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <Headers />
          <div className="body">
            <Columns listData={this.createCountryList()} />
            <Columns listData={this.createCityList()} />
            <Columns listData={this.createCompanyList()} />
            <SimpleMap
              center={this.state.mapCoordinates}
              markerTitle={this.state.Address}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Container;
