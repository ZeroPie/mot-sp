import {
  createSuffledCircles,
  createCircleStats,
  create2DCircle,
  createCircleMovement,
  createStateInfo,
  getNumberOfCorrectAnswers
} from "./helpers.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const compose = (...functions) => (args) =>
  functions.reduceRight((arg, fn) => fn(arg), args);

let canvasWidth = (canvas.width = window.innerWidth);
let canvasHeight = (canvas.height = window.innerHeight);
const container = { x: 0, y: 0, w: canvasWidth, h: canvasHeight };

const state = {
  answers: 0,
  currentRound: 0,
  isRunning: true,
  animationFrameReq: "",
  ratio: 0,
  score: 500,
  tries: 2,
  moveTime: 7000,
  fails: 0,
  velocityChangeProbablity: 0.3,
  directionChangeProbablity: 0.3,
  velocity: 1,
  rounds: [{ number: 0 }],
  correctAnswers: 0
};

const drawCircle = create2DCircle(ctx);
const moveCircle = createCircleMovement(container);
const showState = createStateInfo(ctx)(state);

const showCircleStats = createCircleStats(ctx);
//window.addEventListener("resize", resizeCanvas);

let circles = createSuffledCircles(7, state.velocity);

const highlightCircle = (x, y) => {
  if (!state.isRunning) {
    isCircleInPath(x, y);
  }
};

const isCircleInPath = (x, y) => {
  circles.map((circle) => {
    if (state.answers > 2) {
      state.answers = 0;
      state.currentRound += 1;
      state.ratio = state.correctAnswers / 3;
      state.correctAnswers = circles.reduce(getNumberOfCorrectAnswers, 0);

      if (state.correctAnswers === 3) {
        state.fails = 0;
        state.tries = 2;
      }

      if (state.correctAnswers < 3) {
        state.fails += 1;
        if (state.fails >= 2) {
          state.tries -= 1;
        }
      }

      state.rounds.push({
        number: state.currentRound,
        correctAnswers: state.correctAnswers
      });

      circles = createSuffledCircles(7, state.velocity);
      state.isRunning = true;
      state.correctAnswers = 0;
      if (state.tries > 0) {
        startRound();
      } else {
        console.log("end");
      }
    }
    if (isIntersect(x, y, circle)) {
      if (circle.isSelected === false) {
        circle.color = "white";
        circle.isSelected = true;
        state.answers += 1;
      } else {
        circle.color = circle.initialColor;
        circle.isSelected = false;
        state.answers -= 1;
      }
    }
    showState();
    clearCanvas();
    circles.map(drawCircle);
  });

  function isIntersect(x, y, circle) {
    return Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2) < circle.r;
  }
};

canvas.addEventListener("click", (event) =>
  highlightCircle(event.offsetX, event.offsetY)
);

canvas.addEventListener("click", () => console.log(state));

const run = () => {
  clearCanvas();

  const animate = compose(showState, drawCircle, moveCircle);

  if (state.isRunning) {
    state.animationFrameReq = requestAnimationFrame(run);
    circles.map(animate);
  }
};

const clearCanvas = () => {
  const { x, y, w, h } = container;
  ctx.fillStyle = "black";
  ctx.fillRect(x, y, w, h);
};

const stop = (intervalId, velChangeId) => {
  cancelAnimationFrame(state.animationFrameReq);
  clearInterval(intervalId);
  clearInterval(velChangeId);
  state.isRunning = false;
};

const startRound = () => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  if (state.ratio === 1) {
    state.velocity = state.velocity + state.velocity * 0.05;
  }

  requestAnimationFrame(run);
  state.isRunning = true;
  const dirChangeId = setInterval(randomDirectionChange, state.moveTime / 4);
  const velChangeId = setInterval(randomVelocityChange, state.moveTime / 4);
  setTimeout(() => stop(dirChangeId, velChangeId), state.moveTime);

  setTimeout(turnAllCirclesGreen, state.moveTime / 2);
};

const turnAllCirclesGreen = () =>
  circles.map((circle) => (circle.color = "green"));

const randomVelocityChange = () => {
  circles.map((circle) => {
    if (Math.random() < state.velocityChangeProbablity) {
      circle.vy *= 2;
      circle.vx *= 2;
      setTimeout(() => {
        circle.vy /= 2;
        circle.vx /= 2;
      }, 500);
    }
  });
};

const randomDirectionChange = () => {
  circles.map((circle) => {
    const { vx, vy } = circle;
    if (Math.random() < state.directionChangeProbablity) {
      if (Math.random() < state.directionChangeProbablity) {
        circle.vy = -vx;
      } else {
        circle.vx = -vy;
      }
    }
  });
};

startRound();
