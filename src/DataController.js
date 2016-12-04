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

    grabData: function(query) {
        var objectArray = [];
        var result = "before";
        query = query.replace(" ", "%20");
        //sqoot
        fetch('http://api.sqoot.com/v2/deals?api_key=nBk_SmX1WbhznkZ44N96&online=true&query=' + query)
        .then((res) => {
            // return res.json();
            res = JSON.parse(res);
            for (var i in res.deals) {
                if('key' in i === 'deal') {
                    objectArray.append(dealObject('key'.title, 'key'.provider_name, 'key'.price, 'key'.discount_percentage, 'key'.value, 'key'.image_url, 'key'.url, 'key'.merchant.name.split(" ")[0]));
                }
            };
            return res.query.total;
        });
        // })
        // .then((data) => {
        //     console.log(data.query.total);
        //     return data.query.total;
        // })
        // .then((res) => {
        //     result = res;
        //     console.log(result);
        // });

        //amazon
        // fetch('http://webservices.amazon.com/onca/xml?AWSAccessKeyId=AKIAJH52CXHDZPFFKDAA&AssociateTag=de032a-20&Keywords=' + query + '&Operation=ItemSearch&ResponseGroup=Offers&SearchIndex=All&Service=AWSECommerceService&Timestamp=2016-12-04T01%3A46%3A14.000Z&Signature=QNbC91Vmgl6sNIpQr71Stt%2B6JCHzkFCYf4N3Czsql%2FY%3D')
        // .then((res) => { //parse through xml file
        // })

        // return objectArray;
        console.log(result);
        return result;
    }

    getDummy: function() {
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
    }
  }
}

export default DataController;
