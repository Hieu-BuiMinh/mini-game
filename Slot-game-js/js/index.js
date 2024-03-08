const iconWidth = 79;
const iconHeight = 79;

const numIcons = 9;
const indexes = [0, 0, 0];
const iconMap = [
  "banana",
  "seven",
  "cherry",
  "plum",
  "orange",
  "bell",
  "bar",
  "lemon",
  "melon",
];

const roll = (reel, offset, isWin) => {
  let delta;

  if (isWin) {
    delta = 50;
  } else {
    delta = (offset + 2) * numIcons + Math.round(Math.random() * numIcons);
  }

  const style = getComputedStyle(reel);
  const backgroundPositionY = parseFloat(style["background-position-y"]);
  console.log('backgroundPositionY',backgroundPositionY)

  return new Promise((resolve, reject) => {
    reel.style.transition = "none";
    reel.style.transition = `background-position-y ${
      (offset + 1) * 1000
    }ms cubic-bezier(.41,-0.01,.63,1.09)`;
    reel.style.backgroundPositionY = `${
      backgroundPositionY + delta * iconHeight
    }px`;

    console.log((offset + 1) * 1000);

    setTimeout(() => {
      resolve(delta % numIcons); //  get icon index
    }, (offset + 1) * 1000);
  });
};

const rollAll = (isWin) => {
  const reelsList = document.querySelectorAll(".slots > .reel");

  Promise.all([...reelsList].map((reel, i) => roll(reel, i, isWin))).then(
    (deltas) => {
      deltas.forEach(
        (delta, i) => (indexes[i] = (indexes[i] + delta) % numIcons)
      );

      console.log(indexes.map((index) => iconMap[index]));
      console.log(deltas);

      if (indexes[0] == indexes[1] || indexes[1] == indexes[2]) {
        console.log("WIN WIN WIN");
      }else{
        alert('lose')
      }
    }
  );

  return null;
};

// rollAll();
