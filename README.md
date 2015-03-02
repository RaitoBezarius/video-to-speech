Video to Speech
===============

A mobile web application which goal is to make your phone read text instead of your eyes.
It's just a proof of concept of how to build a quick online OCR (Optical Character Recognition) using Tesseract :

There is the frontend, using Socket.IO, it uploads a image blob to the server (through Socket.IO).
And the server (a.k.a backend) applies OCR on it, and return the text of the image to the frontend (if there is an error, it will just return a generic "I don't know" ("Je sais pas" in french).

The process is quite simple. I would like to improve it :

- Caching similar images (through something like neural networks, I think?)
- Quick OCR and speech synthesis (like it would be *realtime*?).
- Better accessibilities methods and support. (It's very poorly written, I know.)


