import React from 'react';
import DataController from './DataController.js';
import dealObject from './dealObject.js';
import {Button, Collapse} from 'react-bootstrap';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <form id="searchForm">
          <input type="text" /><input type="submit" />
        </form>

        <div id="filterOptions">
        <Button id="filterButton" onClick={ ()=> this.setState({ open: !this.state.open })}>
          Filter <span className="caret"></span>
        </Button>
        <Collapse in={this.state.open}>
          <div>
              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
              Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
          </div>
        </Collapse>
        </div>

        <div id="searchResults">
        <ItemObject itemName="Google" companyName="company" currentPrice="$40.00" discount="40%"
                    imageUrl="defaultImg.png" websiteUrl="https://www.google.com/" sourceName="Sqoot" />
        <ItemObject itemName="Google" companyName="company" currentPrice="$40.00" discount="40%"
                    imageUrl="defaultImg.png" websiteUrl="https://www.google.com/" sourceName="Sqoot" />
        <ItemObject itemName="Google" companyName="company" currentPrice="$40.00" discount="40%"
                    imageUrl="defaultImg.png" websiteUrl="https://www.google.com/" sourceName="Sqoot" />
        <ItemObject itemName="Google" companyName="company" currentPrice="$40.00" discount="40%"
                    imageUrl="defaultImg.png" websiteUrl="https://www.google.com/" sourceName="Sqoot" />
        <ItemObject itemName="Google" companyName="company" currentPrice="$40.00" discount="40%"
                    imageUrl="defaultImg.png" websiteUrl="https://www.google.com/" sourceName="Sqoot" />
        <ItemObject itemName="Google" companyName="company" currentPrice="$40.00" discount="40%"
                    imageUrl="defaultImg.png" websiteUrl="https://www.google.com/" sourceName="Sqoot" />
        <ItemObject itemName="Google" companyName="company" currentPrice="$40.00" discount="40%"
                    imageUrl="defaultImg.png" websiteUrl="https://www.google.com/" sourceName="Sqoot" />
        </div>
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
          <span className="itemDiscount">{this.props.discount} off </span><br />
          Found via {this.props.sourceName}
        </p>
      </div>
    )
  }
}
export default SearchPage;
