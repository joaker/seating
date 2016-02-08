const refer = [
  "Hater McHaterson",
  "GoodGuy Greg",
  "McLovin",
  "Tim Timmerson",
  "Mary Mathews",
  "Sharon Sugars",
  "Robert Robbington",
  "Rog Roberts",
  "Harley Quinn",
  "James Bond",
  "King Arthur",
  "Jewels Vern",
  "Sir Loin of Beef",
  "Mary Sue",
  "Mary Curie",
  "Ada Lovelace",
  "Alan Turing"
];

const relationships = {
  "Hater McHaterson": {
    dislikes: [
      "GoodGuy Greg",
      "McLovin",
      "Tim Timmerson",
      "Mary Mathews",
      "Sharon Sugars",
      "Robert Robbington",
      "Rog Roberts",
      "Harley Quinn",
      "James Bond",
      "King Arthur",
      "Jewels Vern",
      "Sir Loin of Beef",
      "Mary Sue",
      "Mary Curie",
      "Ada Lovelace",
      "Alan Turing"
    ]},
  "GoodGuy Greg": {
    likes: [
      "Hater McHaterson",
      "McLovin",
      "Tim Timmerson",
      "Mary Mathews",
      "Sharon Sugars",
      "Robert Robbington",
      "Rog Roberts",
      "Harley Quinn",
      "James Bond",
      "King Arthur",
      "Jewels Vern",
      "Sir Loin of Beef",
      "Mary Sue",
      "Mary Curie",
      "Ada Lovelace",
      "Alan Turing"
    ]},
  "King Arthur": {
    likes: [
      "Rog Roberts",
      "Harley Quinn",
      "Mary Curie",
      "Ada Lovelace",
      "Alan Turing"
    ],
  dislikes: [
    "James Bond",
    "Jewels Vern",
    "Sir Loin of Beef",
    "Mary Sue",
    ]
  }
};

export default relationships;
