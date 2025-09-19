CREATE MIGRATION m1ihjobz3b3a6rccywwgep7mxigoyrgxqwg7mfblgdxoiisa6d2y3q
    ONTO m13dbbi3jnzfm5s3qo4a7e43bcd4ocg2nf6dycxwsgopbcgnl7hqna
{
  ALTER TYPE default::Tweet {
      CREATE PROPERTY authorProfileImageLocalPath: std::str;
  };
  ALTER TYPE default::TwitterUser {
      CREATE PROPERTY profileImageLocalPath: std::str;
  };
};
