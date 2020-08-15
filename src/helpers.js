/* export const drawCircle = (context, circle) => {
  let { x, y, r, color } = circle;
  context.fillStyle = "hsl(" + color + ", 100%, 50%)";
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, true);
  context.fill();
  return circle;
}; */

const resizeCanvas = () => {
  canvasHeight = window.innerHeight;
  canvasWidth = window.innerWidth;
};

const createRandomPos = (min = 10, max = 600) =>
  Math.trunc(Math.random() * (max - min) + min);

const direction = (velocity) =>
  Math.random() < 0.5 ? velocity * -1 : velocity;

export const createCircle = ({
  id,
  x,
  y,
  r,
  vx,
  vy,
  color,
  initialColor,
  isSelected
}) => ({
  id,
  x,
  y,
  r,
  vx,
  vy,
  color,
  initialColor,
  isSelected
});

export const createCircles = (length, velocity) =>
  Array.from({ length }, (_, i) =>
    i <= 2
      ? createCircle({
          id: i,
          x: createRandomPos(),
          y: createRandomPos(),
          r: 10,
          vx: direction(velocity),
          vy: direction(velocity),
          color: "blue",
          isSelected: false,
          initialColor: "blue"
        })
      : createCircle({
          id: i,
          x: createRandomPos(),
          y: createRandomPos(),
          r: 10,
          vx: direction(velocity),
          vy: direction(velocity),
          color: "green",
          isSelected: false,
          initialColor: "green"
        })
  );

export const createSuffledCircles = (length, velocity) =>
  createCircles(length, velocity)
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);

export const createCircleStats = (ctx) => (circle) => {
  const { id, x, y, r, vx, vy, initialColor, isSelected } = circle;
  ctx.font = "10px";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText(
    `id: ${id}, x: ${x}, y: ${y}, r: ${r} vx: ${vx}, vy: ${vy}, initialColor: ${initialColor}, isSelected: ${isSelected}`,
    x,
    y
  );
};

export const createCircleMovement = (container) => (circle) => {
  const { x, y, r, vx, vy, initialColor, ...rest } = circle;

  if (x - r + vx < container.x || x + r + vx > container.x + container.w) {
    circle.vx = -vx;
  }
  if (y + r + vy > container.y + container.h || y - r + vy < container.y) {
    circle.vy = -vy;
  }
  circle.x += vx;
  circle.y += vy;

  return { x, y, r, vx, vy, initialColor, ...rest };
};

export const create2DCircle = (ctx) => ({
  x,
  y,
  r,
  color,
  initialColor,
  ...rest
}) => {
  let path2d = new Path2D();
  path2d.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill(path2d);
  return { path2d, x, y, r, color, initialColor, ...rest };
};

export const createStateInfo = (ctx) => (state) => () => {
  const {
    isRunning = false,
    score = 0,
    answers = 0,
    rounds = [],
    velocity = 0,
    currentRound = 0
  } = state;
  ctx.font = "20px";
  ctx.fillStyle = "grey";
  ctx.fillText(
    `isRunning: ${isRunning}
  score: ${score}
  answers: ${answers}
  round: ${rounds[currentRound].number}
  velocity: ${velocity}
  `,
    100,
    20
  );
};

export const getNumberOfCorrectAnswers = (acc, current) => {
  if (isCorrect(current)) {
    acc += 1;
  }
  return acc;
};

const isCorrect = ({ initialColor, isSelected }) =>
  isSelected && initialColor === "blue";
