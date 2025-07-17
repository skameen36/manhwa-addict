
export const imgurl = "https://meo.comick.pictures/";

export const recentApiurl = "https://api.comick.io/chapter?page=1&device-memory=8&order=hot";

export const popularApiurl = "https://api.comick.io/top";

 export function timeAgo(timestamp) {
    const past = new Date(timestamp); // Convert API timestamp to Date object
    const now = new Date(); // Get the current local time

    const diffMs = now - past; // Difference in milliseconds

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    if (days < 7) return `${days} days ago`;
    if (weeks < 4) return `${weeks} weeks ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  }