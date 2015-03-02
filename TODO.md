Ideas (maybe naive) and to-do list.
===================================

## Make a Gulp process

- Spawn a dev server.
- Uglify JS & CSS.

## Make a cache store

- MD5 image is not very relevant. How can we cache images approximately?
- I think that we could make a neural network to classify _very_ similar images.
- And in order to verify cache validation, we trigger a Tesseract OCR task and we compare the cache result to the OCR result.
- After that, if the text difference is more than 35%, we conclude that it was a bad similar image.
- We trigger a hotfix as much as we can, if we were wrong. And improve the neural network.

