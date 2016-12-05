import React from 'react';
import DataController from './DataController.js';
import dealObject from './dealObject.js';
import {Button, Collapse, Modal} from 'react-bootstrap';

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objects: []
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    var query = document.querySelector("#queryInput").value;
    var objectArray = [];
    var resultsArr = DataController.grabData(query)
    resultsArr.then((res) => {
      res.deals.forEach((deals) => {
        var deal = deals.deal;
        objectArray.push(new dealObject(deal.title, deal.provider_name, deal.price, deal.discount_percentage, deal.image_url, deal.untracked_url, deal.merchant.name.split(" ")[0]));
      })
      this.setState({objects: objectArray});
    });
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
              <p className="itemDiscount">{this.props.discount * 100}% off </p>
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
