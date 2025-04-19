export const getErrorMessage = (status, data = {}) => {
    if (status === 400) return data.error || "Invalid request.";
    if (status === 401) return "Unauthorized. Please login.";
    if (status === 403) return "Access denied.";
    if (status === 404) return "Resource not found.";
    if (status === 500) return "Server error.";
    return data.error || `Unexpected error (${status}).`;
};
