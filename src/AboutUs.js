import React from 'react';

class AboutUs extends React.Component {
  render() {
    return (
      <div>
        <div role="heading">
          <h2>About Us</h2>
        </div>
        <div>
          <h3 className="h3 text-center section-header">Why DealFinder?</h3>
          <p>The inspiration for this website was the realization that there are very few websites that aggregate the sales from various retailers in a personalized manner. DealFinder seeks to solve this problem by providing users with different sources to shop from multiple places on one website where you can personalize what items you see and keep track of.</p>
        </div>
        <div>
          <h3 className="h3 text-center section-header">What DealFinder does:</h3>
        </div>
        <div>
        <p>With the excessive number of online retailers,it’s hard to keep track of deals for all of your favorite items. With our website, any user looking to save money can use DealFinder to search for deals from a number of online retailers. Users can specify a category of item they are interested in getting deals on, and check back on this list when they log in. In addition, users can filter these searches depending on if they want it to be ranked by price, discount, and whether the list is ascending or descending. The websites utilizes Firebase and React along with a CSS framework.</p>
        </div>
      </div>
    );
  }
}

export default AboutUs;
