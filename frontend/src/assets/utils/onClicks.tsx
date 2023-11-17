export const handleLogout = async (logout: any, navigate: any) => {
    const response = await fetch("/api/logout", {
        method: "POST",
    });

    if (response.ok) {
        logout();
        navigate("../login");
    }
};
