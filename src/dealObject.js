class dealObject {
    constructor(iName, cName, cPrice, dRate, iURL, wURL, sCompany) {
        this.itemName = iName;
        this.companyName = cName;
        this.currentPrice = cPrice;
        this.discountRate = dRate;
        this.imageURL = iURL;
        this.websiteURL = wURL;
        this.sellerCompany = sCompany;
    }
}

export default dealObject;