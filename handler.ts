// Load requirements
import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

import * as request from 'request-promise-native';
import * as Ajv from 'ajv';
import * as fileType from 'file-type';
import * as Sharp from 'sharp';

import { Schema } from './options/options.schema';
import { Mimes } from './options/options.mimes';

// Image handler
export function images(event: APIGatewayEvent, context: Context, callback: Callback) {
  // Setup request validator
  const ajv = new Ajv({coerceTypes: true, useDefaults: true});
  const validate = ajv.compile(Schema);

  // Validate the incoming request params
  if ( validate(event.queryStringParameters) === false ) {
    return callback(null, {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({message: 'Input validation failed: ' + ajv.errorsText(validate.errors).replace('data.', '')})
    });
  }

  // Build S3 image url
  const url = `${process.env.S3_URL}/${event.pathParameters.store}/${event.pathParameters.image}`;

  // Get the image
  request({url, encoding: null})

    // Start the manipulation
    .then((image: Buffer) => {
      // Variables
      let query = event.queryStringParameters;

      // Skip without anything to do
      if ( query === null || Object.keys(query).length <= 0 ) {
        return Promise.resolve(image);
      }

      // Get the initial file type data      
      let metadata = fileType(image);

      // Check mime type is something we can work with
      if ( ! Mimes.includes(metadata.mime) ) {
        throw new Error(`Invalid file type provided (${metadata.mime})`);
      }

      // Start an instance of sharp for our image
      let sharp = Sharp(image);

      // Trim
      if ( query.trim ) {
        sharp.trim(query.trim);
      }

      // Rotate
      if ( query.rotate ) {
        sharp.rotate(query.rotate, {background: ( query.background || undefined )});

        // Flatten the alpha layer to allow background color to show through
        if ( query.background !== undefined && query.background !== 'transparent' ) {
          sharp.flatten({ background: query.background});
        }
      }

      // Crop
      if ( query.width && query.height && query.left && query.top ) {
        sharp.extract({left: query.left, top: query.top, width: query.width, height: query.height});

      // Resize
      } else if ( query.width && query.height ) {
        sharp.resize(query.width, query.height, {fit: query.fit});

      } else if ( query.width ) {
        sharp.resize(query.width, query.width, {fit: query.fit});

      } else if ( query.height ) {
        sharp.resize(query.height, query.height, {fit: query.fit});
      }

      // Flatten alpha layers or add background
      if ( query.flatten === 1 || query.background !== undefined ) {
        sharp.flatten({background: ( query.background || undefined )});
      }

      // Flip/flop
      if ( query.flip === 'xy' || query.flip === 'yx' ) {
        sharp.flip().flop();

      } else if ( query.flip === 'y' ) {
        sharp.flip();

      } else if ( query.flip === 'x' ) {
        sharp.flop();
      }

      // Sharpen
      if ( query.sharpen ) {
        sharp.sharpen();
      }

      // Blur
      if ( query.blur ) {
        sharp.blur(query.blur);
      }

      // Gamma
      if ( query.gamma ) {
        sharp.gamma(query.gamma);
      }

      // Tint
      if ( query.tint ) {
        sharp.tint(query.tint);
      }

      // Grayscale/greyscale
      if ( query.grayscale === 1 || query.greyscale === 1 ) {
        sharp.greyscale(true);
      }

      // Negative
      if ( query.negative === 1 ) {
        sharp.negate(true);
      }

      // Progressive JPEG
      if ( query.progressive === 1 && metadata.mime === 'image/jpeg' ) {
        sharp.jpeg({progressive: true});

      // Progressive PNG
      } else if ( query.progressive === 1 && metadata.mime === 'image/png' ) {
        sharp.png({progressive: true});
      }

      // Render the new image
      return sharp.toBuffer();
    })

    // Send back to user
    .then((image: Buffer) => {
      // Get final file type data
      let metadata = fileType(image);
    
      // Convert and return the image to the user
      return callback(null, {
        statusCode: 200,
        headers: {
          'Content-Type': metadata.mime
        },
        body: image.toString('base64'),
        isBase64Encoded: true
      });
    })

    // Error handler
    .catch((err) => {
      // Request error, 404
      if ( err.statusCode ) {
        return callback(null, {
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({message: 'Image not found'})
        });
      }

      // DEBUG
      console.log(err);

      // General error
      return callback(null, {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({message: err.message})
      });
    });
};
