import React from 'react';
import DataController from './DataController.js';
import dealObject from './dealObject.js';
import {Button, Collapse, Modal} from 'react-bootstrap';
import _ from 'lodash';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: []
    };
  }
  
  sortItems(itemArray) {
    var selectedPriceDisc = document.querySelector('input[name = "priceVSdiscount"]:checked').value;
    var selectedOrder = document.querySelector('input[name = "ascVSdesc"]:checked').value;
    //Sort by price.
    if(selectedPriceDisc == "price") {
      //Sort by price ascending.
      if(selectedOrder === "ascending") {
        return _.sortBy(itemArray, [(obj) => {return obj.currentPrice}])
      } else { //Sort by price descending.
        var newArr = _.sortBy(itemArray, [(obj) => {return obj.currentPrice}]);
        return newArr.reverse();
      }
    } else {
      //Sort by discount.
        //Sort by discount ascending.
      if(selectedOrder === "ascending") {
        return _.sortBy(itemArray, [(obj) => {return obj.discountRate}])
      } else { //Sort by discount descending.
        var newArr = _.sortBy(itemArray, [(obj) => {return obj.discountRate}]);
        return newArr.reverse();
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    var query = document.querySelector("#queryInput").value;
    var objectArray = [];
    var resultsArr = DataController.grabData(query)
    resultsArr.then((res) => {
      res.deals.forEach((deals) => {
        var deal = deals.deal;
        objectArray.push(new dealObject(deal.title, deal.provider_name, deal.price, deal.discount_percentage, 
                          deal.image_url, deal.untracked_url, deal.merchant.name.split(" ")[0]));
      objectArray = this.sortItems(objectArray);
      this.setState({objects: objectArray});
      });
    })
  }

  render() {
    //Map all objects in state to ItemObject components
    var dealObjects = this.state.objects.map((item, id) => {
      return (
        <ItemObject itemName={item.itemName} companyName={item.companyName} currentPrice={item.currentPrice} discount={item.discountRate}
                    imageUrl={item.imageURL} websiteUrl={item.websiteURL} sourceName="Sqoot" key={id}/>
      );
    });

    return (
      <div>
        <form id="searchForm" onSubmit={(e) => this.handleSubmit(e)}>
          <input id="queryInput" type="text" /><input type="submit" />
        </form>

        <Button id="filterButton" onClick={ ()=> this.setState({ open: !this.state.open })}>
          Filter <span className="caret"></span>
        </Button>
        <Collapse id="filterOptions" in={this.state.open}>
          <div>
              <form id="priceVSdiscount">
                <input type="radio" name="priceVSdiscount" value="price" defaultChecked={true}/>Price<br />
                <input type="radio" name="priceVSdiscount" value="discount" /> Discount<br />
              </form>
              <form id="ascVSdesc">
                <input type="radio" name="ascVSdesc" value="ascending" defaultChecked={true}/>Ascending<br />
                <input type="radio" name="ascVSdesc" value="descending" /> Descending<br />
              </form>
          </div>
        </Collapse>

        <div id="searchResults">
          {dealObjects}
        </div>
      </div>
    );
  }
}

class ItemObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  render() {
    return (
        <div className="item" role="button" onClick={this.open}>
          <img className="itemImg" src={this.props.imageUrl} alt={this.props.itemName}/>
          <p className="itemInfo">
            <span className="itemName">{this.props.itemName}</span> <br />
            <span className="itemPrice">${this.props.currentPrice} </span>
            <span className="itemDiscount">{this.props.discount * 100}% off </span><br />
            Found via {this.props.sourceName}
          </p>
          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.itemName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="itemPrice">${this.props.currentPrice} </p>
              <p className="itemDiscount">{Math.round(this.props.discount * 100)}% off </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
    )
  }
}
export default SearchPage;
