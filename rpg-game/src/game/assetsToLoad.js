let assetsToLoad = [
  {
    name: "Actor1",
    type: "character",
    assets: [
      {
        name: "Actor1_back",
        type: "atlas",
        path: `./Actor1_back.json`,
      },
      {
        name: "Actor1_front",
        type: "atlas",
        path: `./Actor1_front.json`,
      },
      {
        name: "Actor1_left",
        type: "atlas",
        path: `./Actor1_left.json`,
      },
      {
        name: "Actor1_right",
        type: "atlas",
        path: `./Actor1_right.json`,
      },
    ],
  },
  {
    name: "map",
    type: "map",
    assets: [
      {
        name: "map",
        type: "jpg",
        path: './scene1.jpg',
      },
    ],
  },
];
export default assetsToLoad