import randomGeneratorHelper from "../helpers/randomGeneratorhelper";

module.exports = {

  postType: {
    regular: "regular_post",
    repost: "repost",
    sellable: "sellable_post"
  },

  postRequestBodyType: {
    regular: "REGULAR",
    sellable: "SELLABLE"
  },

  // randomText: {
  //   positiveData: {
  //     shortText: () => randomGeneratorHelper.generateRandomString(1),
  //     longestText: () => randomGeneratorHelper.generateRandomString(5000),
  //     regularText: () => randomGeneratorHelper.generateRandomString(Math.floor(1 + (Math.random() * 4998)))
  //   },
  //   negativeData: {
  //     invalidText5001Chars: () => randomGeneratorHelper.generateRandomString(5001)
  //   }
  // },

  postBodyData: {
    positiveData: {
      minCharText: '1 char text',
      maxCharText: '5000 chars text',
      imageAndText: '1 image and text',
      singleImage: '1 image',
      singleVideo: '1 video',
      maxImages: '5 images',
      maxVideos: '5 videos',
      mixedFiles: 'mixed files',
      noTextRepost: 'no text repost',
      singleUserMention: 'tagging only one user',
      multipleUserMention: 'tagging several users',
      moderationImage: 'image moderation test',
      moderationVideo: 'video moderation test'
    },
    negativeData: {
      moreThanAllowedCharsText: '5001 chars text',
      moreThanAllowedFileCount: '6 media files',
      invalidPositionMedia: 'order 2, 3 with missing 1',
      noTextNoMedia: 'post with neither text nor media',
      imageAndText: 'negative data for repost with image',
      invalidUserMention: 'using an Id that does not exist',
      anotherUserMedia: 'using media uploaded by another user',
      sameMediaTwice: 'using the same media in the multi-media post'
    }
  },


  postFiles: {
    makeMediaFiles: (images, videos) => randomGeneratorHelper.generateMediaFile(images, videos)
  }
}