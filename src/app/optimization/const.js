import params from '../../data/venue'



export const configA = {
  size: 20,
  rate: 1,
  delay: 50,
  updateDelay: 100,
}

export const configB = {
  size: 100,
  rate: 1,
  delay: 100,
  updateDelay: 100,
}

export const configC = {
  size: 100,
  rate: 4,
  delay: 20,
  updateDelay: 100,
}

export const configC2 = {
  size: 5000,
  rate: 1,
  delay: 20,
  updateDelay: 100,
}

// This works OK, but it interupts socketio operations
export const configD = {
  size: 500,
  rate: 1,
  delay: 200,
  updateDelay: 200,
}
export const config = Object.assign({}, configC);

// config.size = 20;
// config.rate = 5;
// config.delay = 0;
// config.updateDelay = 10;
