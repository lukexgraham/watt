const API_URL = import.meta.env.VITE_API_URL || "";

export const handleLogout = async (logout: any, navigate: any) => {
    const response = await fetch(API_URL + "/api/logout", {
        method: "POST",
    });

    if (response.ok) {
        logout();
        navigate("../login");
    }
};
