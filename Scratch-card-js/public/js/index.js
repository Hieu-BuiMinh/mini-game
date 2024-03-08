import "../js/scratch-card.js";
import {getImageSize} from "./getImageSize.js";
import {confettiSoundPlay, shootConfetties} from "./confetti.js";
import {losingModalCotent, winningModalCotent} from "./modal.js";

const winningContent = winningModalCotent();
const losingContent = losingModalCotent();

let backsoundElSound = null;
let originInitData = null;

document.addEventListener("DOMContentLoaded", () => {
  const onMessageListener = (event) => {
    if (event?.data?.messageType === "NEXT_JS_MESSAGE") {
      console.log("index js log: ", event?.data);
      //// Next js init data here
      originInitData = event?.data;

      initSound();
      initGame();
    }
  };

  window.addEventListener("message", onMessageListener, false);
});

function sendMessage(message) {
  return window.parent.postMessage(message, "*");
}

const GameFakeData = {
  data: {
    sounds: {
      confettiSound: "../assets/sound/confetties_sound.mp3",
      selectCardSound: "../assets/sound/select_sound.mp3",
      backSound: "../assets/sound/game_backsound.mp3",
    },
    cards: [
      {
        scratchLayer: "../assets/img/front_layer_01.png",
        reslultLayer: "../assets/img/back_layer_01.png",
        id: "card_01",
        result: "win",
      },
      {
        scratchLayer: "../assets/img/front_layer_02.png",
        reslultLayer: "../assets/img/back_layer_02.png",
        id: "card_02",
        result: "win",
      },
      {
        scratchLayer: "../assets/img/front_layer_03.png",
        reslultLayer: "../assets/img/back_layer_03.png",
        id: "card_03",
        result: "lose",
      },
    ],
  },
};

// Init Game
const initGame = () => {
  const cardWrapper = document.getElementById("cards__wrapper");

  originInitData.data.cards.map((card) => {
    const scWrapper = document.createElement("div");
    const scContainer = document.createElement("div");
    const scInfos = document.createElement("div");

    scWrapper.classList.add("sc__wrapper");
    scContainer.classList.add("sc__container");
    scInfos.classList.add("sc__infos");

    scContainer.setAttribute("id", `js--sc--container_${card.id}`);
    scInfos.setAttribute("id", `sc__infos_${card.id}`);

    scInfos.innerText = "0%";

    scWrapper.appendChild(scContainer);
    scWrapper.appendChild(scInfos);
    cardWrapper.appendChild(scWrapper);

    getImageSize(card.reslultLayer, ({width, height}) => {
      const containerHeight = (height * scContainer.offsetWidth) / width + 1;

      const sc = new ScratchCard(`#js--sc--container_${card.id}`, {
        scratchType: SCRATCH_TYPE.LINE,
        containerWidth: scContainer.offsetWidth,
        containerHeight: containerHeight,
        imageForwardSrc: card.scratchLayer,
        imageBackgroundSrc: card.reslultLayer,
        htmlBackground: "",
        clearZoneRadius: 20,
        nPoints: 0,
        pointSize: 0,
        percentToFinish: 49,
        callback: function () {
          if (card.result === "win") {
            onWinning();
          } else {
            onLosing();
          }
        },
      });

      sc.init()
        .then(() => {
          sc.canvas.addEventListener("scratch.move", () => {
            sc.canvas.addEventListener("scratch.move", () => {
              let percent = sc.getPercent().toFixed(0);
              scInfos.innerHTML = percent + "%";
            });
          });
        })
        .catch((error) => {
          // image not loaded
          alert(error.message);
        });
    });

    return null;
  });
};

const onWinning = () => {
  setTimeout(shootConfetties, 100);
  confettiSoundPlay();
  setTimeout(() => {
    // alert('You Win')
    sendMessage(winningContent);
  }, 500);
};
const onLosing = () => {
  setTimeout(() => {
    // alert('You Lose')
    sendMessage(losingContent);
  }, 500);
};

const initSound = () => {
  document.getElementById("sound-container").innerHTML = `
	<audio src="${originInitData?.data?.sounds?.confettiSound}" id="confetti-sound" type="audio/mpeg" ></audio>
	<audio src="${originInitData?.data?.sounds?.backSound}" id="game-back-sound" type="audio/mpeg" loop autoplay></audio>
	`;

  backsoundElSound = document.querySelector("#game-back-sound");

  const soundToggle = document.getElementById("backsound-toggle");
  soundToggle.addEventListener("click", () => {
    if (soundToggle.innerHTML.trim() === '<i class="ri-volume-up-fill"></i>') {
      soundToggle.innerHTML = `<i class="ri-volume-mute-fill"></i>`;
      backsoundElSound?.pause();
    } else {
      soundToggle.innerHTML = `<i class="ri-volume-up-fill"></i>`;
      backsoundElSound?.play();
    }
  });

  document.addEventListener(
    "click",
    () => {
      if (backsoundElSound.paused) {
        backsoundElSound.play();
        soundToggle.innerHTML = `<i class="ri-volume-up-fill"></i>`;
      }
    },
    {once: true}
  );
};
