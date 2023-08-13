import supertest from "supertest";

const authRequest = supertest(process.env.FIREBASE_AUTH_URL)
const apiRequest = supertest(process.env.API_BASE_URL)

export default {
    authRequest,
    apiRequest
}