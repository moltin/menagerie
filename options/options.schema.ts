export const Schema = { 
  properties: {
    width: {
      type: 'integer',
      minimum: 1,
      maximum: 2500
    },
    height: {
      type: 'integer',
      minimum: 1,
      maximum: 2500
    },
    fit: {
      type: 'string',
      default: 'cover',
      enum: ['cover', 'contain', 'fill', 'inside', 'outside']
    },
    left: {
      type: 'integer',
      minimum: 1,
      maximum: 2500
    },
    top: {
      type: 'integer',
      minimum: 1,
      maximum: 2500
    },
    trim: {
      type: 'integer',
      minimum: 1,
      maximum: 1000
    },
    progressive: {
      type: 'integer',
      enum: [0, 1]
    },
    flatten: {
      type: 'integer',
      enum: [0, 1]
    },
    background: {
      type: 'string',
      pattern: '^([a-z]+|rgb\\([0-9]{1,3}\\,\\s?[0-9]{1,3}\\,\\s?[0-9]{1,3}\\))$'
    },
    rotate: {
      type: 'integer',
      minimum: -360,
      maximum: 360
    },
    flip: {
      type: 'string',
      enum: ['x', 'y', 'xy', 'yx']
    },
    sharpen: {
      type: 'integer',
      enum: [0, 1]
    },
    blur: {
      type: 'number',
      minimum: 0.3,
      maximum: 1000
    },
    gamma: {
      type: 'number',
      minimum: 1.0,
      maximum: 3.0
    },
    tint: {
      type: 'string',
      pattern: '^([a-z]+|rgb\\([0-9]{1,3}\\,\\s?[0-9]{1,3}\\,\\s?[0-9]{1,3}\\))$'
    },
    grayscale: {
      type: 'integer',
      enum: [0, 1]
    },
    greyscale: {
      type: 'integer',
      enum: [0, 1]
    },
    negative: {
      type: 'integer',
      enum: [0, 1]
    }
  }
};
