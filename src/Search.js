import React from 'react';
import DataController from './DataController.js';
import dealObject from './dealObject.js';

class SearchPage extends React.Component {
  render() {
    return (
      <div>
        <p>Search Page</p>
        <ItemObject itemName="Thing" companyName="company" currentPrice="$40.00" discount="40%"
                    imageUrl="defaultImg.png" websiteUrl="https://www.google.com/" sourceName="Sqoot" />
      </div>
    );
  }
}

class ItemObject extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="item">
        <a href={this.props.websiteUrl}><img className="itemImg" src={this.props.imageUrl} alt={this.props.itemName}/></a>
        <p className="itemInfo">
          <span className="itemName">{this.props.itemName}</span> <br />
          <span className="itemPrice">{this.props.currentPrice} </span> 
          {this.props.discount} <br />
          Found via {this.props.sourceName}
        </p>
      </div>
    )
  }
}
export default SearchPage;
