import BasePage from '../../pages/base_page'
import userData from "../../static/user_data";
import mediaData from "../../static/media_data";

const basePage = new BasePage()

describe("CREATE A MEDIA", function () {
  this.timeout(600000)

  before('Create a new user', async function () {
    await basePage.SignUp()
    await basePage.CreateUser(await userData.username.positiveData.regularUsername())
  })

  it('[C1653] Positive: Upload an Image File JPEG', async () => {
    await basePage.UploadMedia(mediaData.fileNames.image[0].name, mediaData.fileType.image, mediaData.fileNames.image[0].format)
  });

  it('[C1654] Positive: Upload an Image File PNG', async () => {
    await basePage.UploadMedia(mediaData.fileNames.image[1].name, mediaData.fileType.image, mediaData.fileNames.image[1].format)
  });

  it('[C1655] Positive: Upload a Video File MP4', async () => {
    await basePage.UploadMedia(mediaData.fileNames.video[0].name, mediaData.fileType.video, mediaData.fileNames.video[0].format)
  });

  it('[C1656] Positive: Upload a Video File MOV', async () => {
    await basePage.UploadMedia(mediaData.fileNames.video[1].name, mediaData.fileType.video, mediaData.fileNames.video[1].format)
  });

  it('[C1657] Negative: Create a Media with Invalid File Format', async () => {
    await basePage.UploadMedia(mediaData.fileNames.image[0].name, mediaData.fileType.image, mediaData.videoFormat.mp4, mediaData.fileNames.image[0].format)
  });

  after('Delete User', async function () {
    await basePage.DeleteUser()
  })

})