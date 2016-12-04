import dealObject from './dealObject.js';
import 'whatwg-fetch'; //for polyfill

var DataController = {
  getAmazonData: function(searchQuery) {
    var aws_access_key_id = "AKIAJH52CXHDZPFFKDAA";
    var aws_secret_key = "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";
    var endpoint = "webservices.amazon.com";
    var uri = "/onca/xml";
    var timestamp = encodeURIComponent(new Date().toISOString());
    var params = {
      "Service": "AWSECommerceService",
      "Operation": "ItemSearch",
      "AWSAccessKeyId": "AKIAJH52CXHDZPFFKDAA",
      "AssociateTag": "de032a-20",
      "SearchIndex": "All",
      "Keywords": "phone battery",
      "ResponseGroup": "Offers",
      "Timestamp": timestamp
    }
  }
}

export default DataController;
