const express = require("express");
const { postgraphile, makePluginHook } = require("postgraphile");
const PersistedOperationsPlugin = require("@graphile/persisted-operations");
require('dotenv').config();

const pluginHook = makePluginHook([
  PersistedOperationsPlugin,
]);

const app = express();

app.use(
  postgraphile(
    process.env.MAIN_CONNECTION_URL,
    "public",
    {
      // Hard code for now, find them in server-persised-operations.json in the website repo. 
      // Later move to a file with persistedOperationsDirectory.
      pluginHook,
      persistedOperations: {
        "1bbab2302545229de50655449dfa5ee591d7be8085a36c3da258ffcdb370ae67": "query GetAuctions($offset: Int!) {\n  allAuctions(orderBy: BID_START_BLOCK_DESC, first: 10, offset: $offset) {\n    nodes {\n      address\n      name\n      bidStartBlock\n      mintStartBlock\n      chainId\n      maxUnits\n      price\n      bidsByAuctionAddressAndAuctionName {\n        totalCount\n        __typename\n      }\n      __typename\n    }\n    totalCount\n    __typename\n  }\n}",
        "a9ff872eab405afe12c29862a816d25c04f06bbad7abdc33b81a6875d1084ea3": "query GetAuction($address: String!, $name: String!) {\n  auctionByAddressAndName(address: $address, name: $name) {\n    address\n    name\n    price\n    bidStartBlock\n    mintStartBlock\n    maxUnits\n    chainId\n    bidsByAuctionAddressAndAuctionName {\n      totalCount\n      __typename\n    }\n    __typename\n  }\n}",
        "8bef4258cdbf25ef766ac224d89118747381a7829fdc473b2996a2fdcb436aa5": "query GetAuctionUnsettledBidsCount($address: String!, $name: String!) {\n  auctionByAddressAndName(name: $name, address: $address) {\n    bidsByAuctionAddressAndAuctionName(condition: {status: SUBMITTED}) {\n      totalCount\n      __typename\n    }\n    __typename\n  }\n}",
        "1eb8bdfd3c36c868f2b96bd81f618cb08e325fd4e4df61e0eb9dbd35d5658a0a": "query GetAuctionBids($address: String!, $name: String!, $offset: Int!, $orderBy: [BidsOrderBy!]) {\n  auctionByAddressAndName(address: $address, name: $name) {\n    chainId\n    bidsByAuctionAddressAndAuctionName(first: 10, offset: $offset, orderBy: $orderBy) {\n      nodes {\n        bidId\n        signer\n        status\n        submittedTimestamp\n        tipRevealed\n        amount\n        __typename\n      }\n      totalCount\n      __typename\n    }\n    __typename\n  }\n}",
        "cd6710d56b63c80501ec0e5e15991395fdab9e995ee5033c3b286f325a033fe8": "query GetBid($bidId: String!) {\n  bidByBidId(bidId: $bidId) {\n    bidId\n    auctionAddress\n    auctionName\n    bundleHash\n    replacedBy\n    signer\n    signature\n    status\n    submittedTimestamp\n    statusLastUpdated\n    tipRevealed\n    txHash\n    amount\n    auctionByAuctionAddressAndAuctionName {\n      price\n      chainId\n      __typename\n    }\n    __typename\n  }\n}",
        "870ccbdbfb9a159a95c62c424e260a89001e9cccbda5a1086a869dbfd109026c": "query HealthCheck {\n  __typename\n}"
      },
      enableCors: true,
      ownerConnectionString: process.env.OWNER_CONNECTION_URL,
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
    }
  ),
);

app.get('/pika', (req, res) => {
  console.log('pikachu!');
  res.status(200).send('⣿⣿⡿⠿⠿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠩⣝⠿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢌⢷⣄⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀\n⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠉⠉⠉⠉⠉⠉⠉⠙⠓⠒⠒⠶⠶\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠃⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⠀⠀⠀⠀⡀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⠀⠀⠀⣼⣶⠟⠲⣦⣴⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⢹⣽⣶⣤⡀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡟⠀⠀⠀⠀⠀⠉⠀⠀⢠⡿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣾⠀⠉⠉⠛⠲⠶⢤⣄⣀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠟⠙⠳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⣶⣯⣧⣤⣄⡐⢀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡏⠀⠀⠀⢹⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠭⠇⠀⠀⠀⠀⠀⠀⠙⠓⠂⠀⢉⡻⣶⡀⠀⠀⠀⠀⠀⠀⣾⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⡀⠀⠀⠀⠀⠀⣿⡃⠀⠀⠀⢸⡇⠀⠀⠀⠀⠰⣦⡀⠀⢀⣰⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠋⠀⠀⠀⠀⠀⠀⠀⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⣴⡿⠇⢟⠦⢤⣀⠀⠀⢻⡇⠀⠀⢀⣼⠇⡀⠀⠀⠀⠀⠈⢻⣿⣿⣿⣿⣦⡀⠀⠀⢀⡴⠀⠀⠀⠀⠀⠀⢀⣀⣀⡀⠀⠀⠀⠀⢀⡇⠀⠀⠀⠀⠀⠀⡤⠔⠒\n⠀⠀⠀⠀⠀⠀⠀⡿⢃⣀⡶⠀⠀⠈⠓⢦⡀⢿⡀⣄⣿⡟⠀⠀⠀⠀⠀⠀⠀⢸⡏⠀⠀⠀⠉⠛⣷⠖⠋⠁⠀⠀⠀⢀⣴⠾⠋⠉⠉⠙⢷⣄⠀⠀⣸⠀⠀⠀⠀⠀⠀⠀⢷⠀⠀\n⠀⠀⠀⠀⠀⠀⢸⡇⣴⠟⠗⠂⠀⠀⠀⠁⠙⠺⣟⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠸⡇⠀⠀⠀⠀⢱⡟⠀⠀⠀⠀⠀⠀⣼⣯⠀⠀⠀⠀⠀⠀⢻⡀⠀⡏⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀\n⠀⠀⠀⠀⠀⠀⠈⢿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⢠⡟⠀⠀⠀⠀⠀⠀⢰⡿⠓⠀⠀⠀⠀⠀⠀⣸⠇⣸⠁⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⡀⠀⢠⡿⠁⠀⠀⠀⠀⠀⠀⠈⢿⣆⡀⠰⠆⠀⠀⣰⡿⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⢻⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⣄⠀⠀⠀⠀⠀⠀⠀⠘⢧⠴⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢷⣤⣤⣤⠶⠛⣱⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡇⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠈⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠛⠲⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⡛⠲⠶⠤⢤⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠳⢮⣉⠀⠀⠀⠀⠀⠀⣿⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢧⡀⠀⠀⠀⠀⠀⢠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠦⠤⠤⠤⠖⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⡀⠉⠳⣶⠒⠚⠛⠋⠉⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⣄⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⡖⠛⠉⠉⠁⠀⠀⠈⠉⠁⠀⠀⠈⢳⡀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣳⣄⡀⠀⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣆⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣬⣷⡍⠳⣦⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢾⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⡦⠤⠒\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠒⠋⠁⠀⠀⢿⣦⣾⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⣶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣮⡙⠦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀\n⣏⡀⠀⠀⣀⣤⡄⢀⡀⠀⠀⠀⠐⠒⠀⠘⣻⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣆⠈⠛⠶⣄⡀⠀⠀⠀⢀⣤⣾⣷⣰⣶\n⣯⠀⠀⢤⣭⣬⣤⣠⣤⣀⣠⠀⡀⠀⠀⢠⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣯⡛⢦⣤⣀⣉⡉⣛⣛⣽⠿⠣⣿⡟⠛\n');
});

app.listen(process.env.PORT || 5000);
