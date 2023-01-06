const express = require("express");
const { postgraphile, makePluginHook } = require("postgraphile");
// import PersistedOperationsPlugin from "@graphile/persisted-operations";
const PersistedOperationsPlugin = require("@graphile/persisted-operations");
require('dotenv').config();

const pluginHook = makePluginHook([PersistedOperationsPlugin]);

const app = express();

app.use(
  postgraphile(
    process.env.MAIN_CONNECTION_URL,
    "public",
    {
      pluginHook,
      // Hard code for now, find them in server-persised-operations.json in the website repo. 
      // Later move to a file with persistedOperationsDirectory.
      persistedOperations: {
        "6ab7d13deed0efcfb3855519e7197180823d75a09d7e52dbc48a7bbe5303d161": "query GetAuctions {\n  allAuctions(orderBy: BID_START_BLOCK_DESC, first: 100) {\n    nodes {\n      address\n      name\n      bidStartBlock\n      mintStartBlock\n      chainId\n      maxUnits\n      price\n      bidsByAuctionAddressAndAuctionName {\n        totalCount\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",
        "4fab3f43e832e8cf8b9273e25fb566ea957162da322fd215a6c6d6b027a967bd": "query GetAuction($address: String!, $name: String!) {\n  auctionByAddressAndName(address: $address, name: $name) {\n    address\n    name\n    price\n    bidStartBlock\n    mintStartBlock\n    maxUnits\n    chainId\n    bidsByAuctionAddressAndAuctionName(first: 100, orderBy: SUBMITTED_TIMESTAMP_DESC) {\n      nodes {\n        bidId\n        signer\n        status\n        submittedTimestamp\n        tipRevealed\n        amount\n        __typename\n      }\n      totalCount\n      __typename\n    }\n    bundlesByAuctionAddressAndAuctionName {\n      nodes {\n        bundleHash\n        signerAddress\n        __typename\n      }\n      totalCount\n      __typename\n    }\n    __typename\n  }\n}",
        "02c60a4ff267b7d010daf4ea6dfba380b6a2c377c712bfae968fe941715aa580": "query GetBid($bidId: String!) {\n  bidByBidId(bidId: $bidId) {\n    bidId\n    auctionAddress\n    auctionName\n    bundleHash\n    replacedBy\n    signer\n    signature\n    status\n    submittedTimestamp\n    statusLastUpdated\n    tipRevealed\n    txHash\n    amount\n    auctionByAuctionAddressAndAuctionName {\n      price\n      __typename\n    }\n    __typename\n  }\n}"
      },
      enableCors: true,
      ownerConnectionString: process.env.OWNER_CONNECTION_URL,
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
    }
  ),
);

app.listen(process.env.PORT || 5000);
