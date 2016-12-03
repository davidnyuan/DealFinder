import React from 'react';
import DataController from './DataController.js';
import dealObject from './dealObject.js';

class SearchPage extends React.Component {
  render() {
    return (
      <div>
        <p>Search Page</p>
        <ItemObject itemName="itemName" companyName="company" currentPrice="cPrice" discount="discountPerc"
                    imageUrl="img" websiteUrl="https://www.google.com/" sourceName="source" />
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
      <div>
        <a href={this.props.websiteUrl}><img src="" alt={this.props.itemName}/></a>
        <p>{this.props.itemName}</p>
      </div>
    )
  }
}
export default SearchPage;
