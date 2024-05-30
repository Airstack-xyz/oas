module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/hubs",
        permanent: false,
      },
    ];
  },
};
