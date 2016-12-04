import React from 'react';
import DataController from './DataController.js';
import dealObject from './dealObject.js';
import {Button, Collapse} from 'react-bootstrap';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: []
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    var controller = new DataController();
    console.log("Submitted!");
    var resultsArr = controller.grabData('headphones');
    // var resultsArr = controller.getDummy();
    console.log(resultsArr);
    // this.setState({objects: resultsArr});
  }

  render() {
    //Map all objects in state to ItemObject components
    var dealObjects = this.state.objects.map((item) => {
      return (
        <ItemObject itemName={item.itemName} companyName={item.companyName} currentPrice={item.currentPrice} discount={item.discountRate}
                    imageUrl={item.imageURL} websiteUrl={item.websiteURL} sourceName="Sqoot" />
      );
    });

    return (
      <div>
        <form id="searchForm" onSubmit={(e) => this.handleSubmit(e)}>
          <input type="text" /><input type="submit" />
        </form>

        <Button id="filterButton" onClick={ ()=> this.setState({ open: !this.state.open })}>
          Filter <span className="caret"></span>
        </Button>
        <Collapse id="filterOptions" in={this.state.open}>
          <div>
              <form>
                <input type="radio" name="filterOp" value="price" />Price<br />
                <input type="radio" name="filterOp" value="discount" /> Discount<br />
              </form>
              <form>
                <input type="radio" name="filterOp" value="ascending" />Ascending<br />
                <input type="radio" name="filterOp" value="descending" /> Descending<br />
              </form>
          </div>
        </Collapse>

        <div id="searchResults">
        {dealObjects}
        {/*<ItemObject itemName="Google" companyName="company" currentPrice="$40.00" discount="40%"
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
                    */}
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
