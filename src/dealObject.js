class dealObject {
    constructor(iName, cName, cPrice, dRate, iURL, wURL, sCompany, cAt, eAt) {
        this.itemName = iName;
        this.companyName = cName;
        this.currentPrice = cPrice;
        this.discountRate = dRate;
        this.imageURL = iURL;
        this.websiteURL = wURL;
        this.sellerCompany = sCompany;
        this.createdAt = cAt;
        this.expiresAt = eAt;
    }
}

export default dealObject;