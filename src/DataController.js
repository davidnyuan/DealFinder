import dealObject from './dealObject.js';
import 'whatwg-fetch'; //for polyfill
import CryptoJS from 'crypto-js';

var DataController = {
  getAmazonData: function(searchQuery) {
    var aws_access_key_id = "AKIAJH52CXHDZPFFKDAA";
    var aws_secret_key = "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";
    var endpoint = "webservices.amazon.com";
    var uri = "/onca/xml";
    var timestamp = new Date().toISOString();
    var params = {
      "Service": "AWSECommerceService",
      "Operation": "ItemSearch",
      "AWSAccessKeyId": "AKIAJH52CXHDZPFFKDAA",
      "AssociateTag": "de032a-20",
      "SearchIndex": "All",
      "Keywords": "phone battery",
      "Keywords": searchQuery,
      "ResponseGroup": "Offers",
      "Timestamp": timestamp
    }
    var keys = Object.keys(params).sort();
    var pairs = [];
    keys.forEach(key => pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key])));
    var canonical_query_string = pairs.join("&");
    var string_to_sign = "GET\n" + endpoint + "\n" + uri + "\n" + canonical_query_string;
    var hash = CryptoJS.HmacSHA256(string_to_sign, aws_secret_key);
    var signature = CryptoJS.enc.Base64.stringify(hash);
    var request_url = 'https://' + endpoint + uri + '?' +
      canonical_query_string + '&Signature=' + signature;
    console.log(request_url);
    // return fetch(request_url, {mode:'no-cors'})
    //   .then(res => console.log(res))
    //   .catch(e => console.log(e));
    // does not work.  403 forbidden error???
  },

  grabData: function (query) {
    var objectArray = [];
    var result = "before";
    query = query.replace(" ", "%20");
    //sqoot
    return fetch('http://api.sqoot.com/v2/deals?api_key=nBk_SmX1WbhznkZ44N96&online=true&query=' + query)
      .then((res) => {
          return res.json();
      });
    
    //amazon
    // fetch('http://webservices.amazon.com/onca/xml?AWSAccessKeyId=AKIAJH52CXHDZPFFKDAA&AssociateTag=de032a-20&Keywords=' + query + '&Operation=ItemSearch&ResponseGroup=Offers&SearchIndex=All&Service=AWSECommerceService&Timestamp=' + expTimeStr + 'Z&Signature=zcfBqz853QbywCGQCcuPQ54CLgxthzp2VBJLbGStx3k%3D')
    // .then((res) => { //parse through xml file
    // })
  },

  getDummy: function () {
        console.log("Dummy received");
        var dummyObject = [{
            itemName: 'item',
            companyName: 'company',
            currentPrice: 'currPrice',
            discountRate: 'discRate',
            originalPrice: 'origPrice',
            imageURL: 'defaultImg.png',
            websiteURL: 'https://www.google.com/',
            sellerCompany: 'company'
        }]
        return dummyObject;
  },

  // THIS ONE ALSO DOESNT WORK
  getRakuten: function(keywords) {
    
    fetch("http://api.popshops.com/v2/brgymtenmw5ea9unauesmh9nz/products.xml?catalog_key=48qsligejm5qng6cv5waprcoq&keywords=ipod&include_deals=1")
      .then(res => res.json())
      .then(json => console.log(json));
  }
}

export default DataController;
