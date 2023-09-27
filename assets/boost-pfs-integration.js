var boostPFSIntegrationTemplate = {
    compileTemplate: {
      reviews: "var itemOkendoReviewsHtml = Utils.getProductMetafield(data, 'okendo', 'ProductListingSnippet') !== null ? Utils.getProductMetafield(data, 'okendo', 'ProductListingSnippet') : ''; itemHtml = itemHtml.replace(/{{itemReviews}}/g, itemOkendoReviewsHtml);"
    },
    call3rdFunction: {
      reviews: ''
    }
  };