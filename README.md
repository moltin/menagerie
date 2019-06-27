# Menagerie
Serverless image resizing, manipulation, and optimzation S3 proxy.

## Install
You'll need to install the dependencies for the project, and more specifically build the binaries for deployment to Lambda. To do this open up terminal and in the directory run:

``` bash
npm install
rm -rf node_modules/sharp
npm install --arch=x64 --platform=linux --target=10.15.0 sharp --save
```

> **Note:** Initially used yarn but couldn't get the dependencies to build correctly for lambda.

To configure the project, open up `serverless.yml` and change `enviornment.S3_URL` to the correct bucket, as well as the `alias` domain to your own (or remove if not needed). Defaults have been left as the current community bucket, and `https://commercecdn.com` as an example.

## Deployment
Requires the serverless CLI, to install run: `npm install -g serverless`

In addition `serverless` Requires you to have AWS credentials stored within serverless, guide to create and install them is available [here](http://bit.ly/aws-creds-setup).

`serverless deploy -v` for serverless.yml changes

`serverless deploy -f images` for handler changes

## Usage
Menagerie acts as a proxy to your hosted S3 images, to use it instead of S3 directly simply replace the S3 URL in your image too reference the serverless endpoint, for example:

If your image URL is `https://s3-eu-west-1.amazonaws.com/bkt-svc-files-cmty-api-moltin-com/8fe0f257-a448-46ee-9ce8-cd178c26476e/2a6c86cb-3409-4539-9fb6-49b7bb4171f9.png`

And your deployed serverless function is `https://lfwjbmjpje.execute-api.eu-west-1.amazonaws.com/dev`

Your new image URL would then become `https://lfwjbmjpje.execute-api.eu-west-1.amazonaws.com/dev/8fe0f257-a448-46ee-9ce8-cd178c26476e/2a6c86cb-3409-4539-9fb6-49b7bb4171f9.png`

## Options
The following are the available URL params to use with your images.

**height** - Resize the image height, _max 2500_

**width** - Resize the image width, _max 2500_

**fit** - How the image is scaled when resizing, options are:
  - `cover` fills the size, but maintains aspect ratio _(default)_
  - `contain` image best fits new aspect ratio
  - `fill` stretches too fit the new image dimensins
  - `inside` maintains aspect ratio up to the smallest dimension
  - `outside` maintains aspcet ratio up to the largest dimension

**top** & **left** - Used together with `width` and `height` to crop the image. example:
  - `height` = 250
  - `width` = 250
  - `top` = 100
  - `left` = 200
 
Will produce a new 250x250 cropped image, using the data `100` pixels from the top, and `200` pixels from the left.

**rotate** - Number of degrees to rotate the image, _-360 to 360_

**flip** - Flips, or flops the image, options are:
  - `xy`/`yx` to flip both horizontally and vertically
  - `x` to flip horizontally
  - or `y` to flip vertically

**background** - Sets the background color for the image when it's being resized, or rotated, options are:
  - Colors, for example `red`, `green`, `purple`, `orange`, etc.
  - Hex codes, with `#` encoded as `%23`, for example `%23ff0000` would be red
  - `transparent` when dealing with image formats that support it
  - or `rgb(x, x, x)` so `rgb(255, 0, 0)` for red, gives much more fine grained control
 
**trim** - Reduces "uninteresting" areas around the image, _intensity is from 1 to 1000_

**sharpen** - Sharpens the original imxage, _boolean 1 or 0_

**blur** - Blur the original image, also maintains transparency, _intensity is from 0.3 to 1000_

**grayscale** or **greyscale** - Make a black and white version of the image, _boolean 1 or 0_

**tint** - Alters the images color, see `background` for options

**negative** - Invert the original images color pallete, _boolean 1 or 0_

**progressive** - If the image is a `JPEG` or `PNG` will return it as a progressive one, _boolean 1 or 0_

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details