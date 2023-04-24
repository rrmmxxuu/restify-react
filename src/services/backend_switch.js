export const API_BASE_URL = () => {
    const relative = false
    const gc = true
    if (relative) {
        return ''
    }
    if (gc) {
        return 'https://restify-api-rtqaemum5q-uc.a.run.app'
    }
    return 'localhost:8000'
}