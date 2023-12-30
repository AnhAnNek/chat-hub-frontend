function bearerAuth(accessToken) {
    return `Bearer ${accessToken}`;
}

export { bearerAuth };