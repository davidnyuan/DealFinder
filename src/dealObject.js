class dealObject {
    constructor(iName, cName, cPrice, dRate, oPrice, iURL, wURL, sCompany) {
        this.itemName = iName;
        this.companyName = cName;
        this.currentPrice = cPrice;
        this.discountRate = dRate;
        this.originalPrice = oPrice;
        this.imageURL = iURL;
        this.websiteURL = wURL;
        this.sellerCompany = sCompany;
    }
}

export default dealObject;