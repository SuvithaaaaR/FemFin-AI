// Central export for all controllers
module.exports = {
  auth: require("./authController"),
  fundRecommendation: require("./fundRecommendationController"),
  crowdfunding: require("./crowdfundingController"),
  creditScoring: require("./creditScoringController"),
  fund: require("./fundController"),
  ai: require("./aiController"),
  sentiment: require("./sentimentController"),
};
