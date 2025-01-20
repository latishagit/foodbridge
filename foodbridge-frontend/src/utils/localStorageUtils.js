export function getUserFromLocalStorage() {
    const rawData = localStorage.getItem('user');
    console.log("Raw data from localStorage:", rawData); // Debugging
    try {
        return rawData ? JSON.parse(rawData) : null;
    } catch (error) {
        console.error("Error parsing user data from localStorage. Raw data:", rawData, error);
        return null;
    }
}

export function setUserToLocalStorage(user) {
    console.log("Storing user:", user); // Debugging
    if (user && typeof user === 'object') {
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        console.error("Invalid user object:", user);
    }
}

