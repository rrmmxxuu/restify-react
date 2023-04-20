export const API_BASE_URL = () => {
    const gc = true
    if (gc) {
        return 'https://restify-api-rtqaemum5q-uc.a.run.app'
    } else {
        return 'http://localhost:8000'
    }
}