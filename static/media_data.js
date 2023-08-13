module.exports = {
  imageFormat: {
    jpeg: 'image/jpeg',
    jpg: 'image/jpg',
    png: 'image/png'
  },
  videoFormat: {
    mov: 'video/mov',
    mpeg4: 'video/mpeg4',
    mp4: 'video/mp4'
  },

  fileType: {
    image: 'image',
    video: 'video'
  },

  //MAKE SURE TO HAVE DIFFERENT FORMAT FILES AT THE BEGINNING OF THE FILE NAMES LISTS
  fileNames: {
    image: [
      {name: 'photo1.jpeg', format: 'image/jpeg'},
      {name: 'photo2.png', format: 'image/png'},
      {name: 'photo3.jpeg', format: 'image/jpeg'},
      {name: 'photo4.jpeg', format: 'image/jpeg'},
      {name: 'photo5.jpeg', format: 'image/jpeg'},
      {name: 'photo6.jpeg', format: 'image/jpeg'},
      {name: 'photo7.jpeg', format: 'image/jpeg'},
      {name: 'moderationtest.jpeg', format: 'image/jpeg'}
    ],
    video: [
      {name: 'video1-vertical.mp4', format: 'video/mp4'},
      {name: 'video2-horizontal.mov', format: 'video/mov'},
      {name: 'video3-horizontal.mp4', format: 'video/mp4'},
      {name: 'video4-horizontal.mov', format: 'video/mov'},
      {name: 'video5-vertical.mp4', format: 'video/mp4'},
      {name: 'video6-vertical.mp4', format: 'video/mp4'},
      {name: 'video7-horizontal.mp4', format: 'video/mp4'},
      {name: 'moderationtest.mp4', format: 'video/mp4'}

    ]
  }
}




