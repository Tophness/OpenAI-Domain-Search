const express = require('express');
const proxy = require('express-http-proxy');

const app = express();
app.use(express.static('public'));
app.use(proxy('https://www.domain.com.au', {
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    if (srcReq.url.indexOf('/rent') !== -1) {
       proxyReqOpts.headers["content-type"] = "application/json; charset=utf-8";
       proxyReqOpts.headers["accept"] = "application/json";
    }
    proxyReqOpts.headers["Access-Control-Allow-Origin"] = "*";
    proxyReqOpts.headers["Access-Control-Allow-Methods"] = "*";
    proxyReqOpts.headers["Access-Control-Allow-Headers"] = "*";
    proxyReqOpts.headers["Access-Control-Allow-Credentials"] = "true";
    return proxyReqOpts;
  },
  userResDecorator: function(proxyRes, proxyResData, req, res) {
    if (req.url.indexOf('/rent') !== -1) {
      const data = JSON.parse(proxyResData.toString('utf8'));
      if (data.props && data.props.listingsMap) {
        let trimmedData = data.props.listingsMap;
        const numKeys = Object.keys(trimmedData);
        const numObjects = numKeys.length;
          if (numObjects > 50) {
          for (let i = 50; i < numObjects; i++) {
            delete trimmedData[numKeys[i]];
          }
        }
        for (const id in trimmedData) {
         if (trimmedData.hasOwnProperty(id)) {
           delete trimmedData[id].id;
           delete trimmedData[id].listingType;
           delete trimmedData[id].listingModel.skeletonImages;
           delete trimmedData[id].listingModel.auction;
           delete trimmedData[id].listingModel.branding;
           delete trimmedData[id].listingModel.brandingAppearance;
           delete trimmedData[id].listingModel.displaySearchPriceRange;
           delete trimmedData[id].listingModel.enableSingleLineAddress;
           delete trimmedData[id].listingModel.hasVideo;
           delete trimmedData[id].listingModel.promoType;
           delete trimmedData[id].listingModel.tags;
         }
        }
        const imgParam = req.url.match('[?&]images=([^&]+)');
        if (imgParam) {
          const numImages = parseInt(imgParam[1]);
          if(numImages > 0){
            for (let key in trimmedData) {
              if (trimmedData.hasOwnProperty(key)) {
                const images = trimmedData[key].listingModel.images;
                if (Array.isArray(images) && images.length > numImages) {
                  trimmedData[key].listingModel.images = images.slice(0, numImages);
                }
              }
            }
          }
          else{
            for (let key in trimmedData) {
              if (trimmedData.hasOwnProperty(key)) {
                delete trimmedData[key].listingModel.images;
              }
            }
          }
        }
        else{
            for (let key in trimmedData) {
              if (trimmedData.hasOwnProperty(key)) {
                delete trimmedData[key].listingModel.images;
              }
            }
        }
        trimmedData = {
          'totalPages': data.props.pageViewMetadata.searchResponse.SearchResults.totalPages,
          'page': data.props.pageViewMetadata.searchResponse.SearchResults.page,
          'totalResults': data.props.pageViewMetadata.searchResponse.SearchResults.totalResults,
          'resultsPerPage': data.props.listingSearchResultIds.length,
          'listings': trimmedData
        };
        return JSON.stringify(trimmedData);
      }
      else{
         return proxyResData;
      }
    }
    else{
       return proxyResData;
    }
  }
}));

const server = app.listen(443);