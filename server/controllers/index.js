// Central export for all controllers
module.exports = {
  auth: require("./authController"),
  fundRecommendation: require("./fundRecommendationController"),
  crowdfunding: require("./crowdfundingController"),
  creditScoring: require("./creditScoringController"),
};
