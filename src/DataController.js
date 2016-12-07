import 'whatwg-fetch'; //for polyfill
import CryptoJS from 'crypto-js';

var DataController = {
  // does not work.  403 forbidden error???
  getAmazonData: function(searchQuery) {
    var aws_access_key_id = "AKIAJH52CXHDZPFFKDAA";
    var aws_secret_key = "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";
    var endpoint = "webservices.amazon.com";
    var uri = "/onca/xml";
    var timestamp = new Date().toISOString();
    var params = {
      "Service": "AWSECommerceService",
      "Operation": "ItemSearch",
      "AWSAccessKeyId": aws_access_key_id,
      "AssociateTag": "de032a-20",
      "SearchIndex": "All",
      "Keywords": searchQuery,
      "ResponseGroup": "Offers",
      "Timestamp": timestamp
    }
    var keys = Object.keys(params).sort();
    var pairs = [];
    keys.forEach(key => pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key])));
    var canonical_query_string = pairs.join("&");
    var string_to_sign = "GET0A" + endpoint + "0A" + uri + "0A" + canonical_query_string;
    var hash = CryptoJS.HmacSHA256(string_to_sign, aws_secret_key);
    var signature = CryptoJS.enc.Base64.stringify(hash);
    var request_url = 'https://' + endpoint + uri + '?' +
      canonical_query_string + '&Signature=' + signature;
    console.log(request_url);
    return fetch(request_url)
      .then(res => console.log(res))
      .catch(e => console.log(e));
  },

  grabData: function (query, perPage) {
    query = query.replace(" ", "%20");
    //sqoot
    return fetch('http://api.sqoot.com/v2/deals?api_key=nBk_SmX1WbhznkZ44N96&per_page=' + perPage + '&online=true&query=' + query)
      .then((res) => {
          
          return res.json();
      });
  },

  // THIS ONE ALSO DOESNT WORK
  getRakuten: function(keywords) {

    fetch("http://api.popshops.com/v2/brgymtenmw5ea9unauesmh9nz/products.xml?catalog_key=48qsligejm5qng6cv5waprcoq&keywords=ipod&include_deals=1")
      .then(res => res.json())
      .then(json => console.log(json));
  },

  // curl -X GET \
  //   -H "X-INAB-Application-Id: 08aa2798" \
  //   -H "X-INAB-REST-API-Key: 6d7a9c9c9691f611a410c19ad84baf8a" \
  //   http://www.ineedabargain.com/api/deals

  // ALSO DOES NOT WORK
  getBargain: function(keywords) {
    fetch("http://www.ineedabargain.com/api/deals", {
      header: {
        "X-INAB-Application-Id": "08aa2798",
        "X-INAB-REST-API-Key": "6d7a9c9c9691f611a410c19ad84baf8a"
      }
    }).then(res => console.log(res));
  }
}

export default DataController;
