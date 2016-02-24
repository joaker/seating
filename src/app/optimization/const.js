import params from '../../data/venue'



export const configA = {
  size: 50,
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
  size: 50,
  rate: 4,
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

export const config = configC;
