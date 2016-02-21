import params from '../../data/venue'



const configA = {
  size: 50,
  rate: 2,
  delay: 50,
}

export const configB = {
  size: 100,
  rate: 1,
  delay: 100,
}

// This works OK, but it interupts socketio operations
export const configC = {
  size: 500,
  rate: 1,
  delay: 200,
}

export const config = configC;
