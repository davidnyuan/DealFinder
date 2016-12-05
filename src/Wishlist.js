import React from 'react';

class WishlistPage extends React.Component {
  handleSubmit(event) {
    event.preventDefault();

  }

  render() {
    return (
      <div>
        <form id="searchForm" onSubmit={(e) => this.handleSubmit(e)}>
          <input id="queryInput" type="text" /><input type="submit" value="Add to List"/>
        </form>
      </div>
    );
  }
}

export default WishlistPage;
