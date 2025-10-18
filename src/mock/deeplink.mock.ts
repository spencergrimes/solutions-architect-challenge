// this is a mock implementation of the deep link generation
    // in a real implementation, this would be a call to the deep link provider
    // for this mock implementation, we will just return random alphanumeric characters
export const generateDeepLink = (originalUrl: string) => {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `https://cartoncaps.link/${randomString}`;
}