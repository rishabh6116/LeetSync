# LeetSync

LeetSync is a sleek and responsive web application designed to instantly check and visualize a user's LeetCode problem-solving progress and profile statistics. It fetches real-time data from public APIs related to LeetCode stats and displays metrics such as problem counts by difficulty, acceptance rate, ranking, contributions, reputation, and profile details in an engaging dashboard.

## Features

- Search for any LeetCode username to fetch live stats and profile information.
- Overview of problems solved categorized by difficulty: Easy, Medium, and Hard.
- Display total problems solved, total available problems, acceptance rate, ranking, contribution points, and reputation.
- Profile card with user avatar, username, handle, and country.
- Responsive and modern UI with animated transitions and clear visual hierarchy.
- Error handling for invalid usernames or API failures.
- Clean design with dark mode aesthetics using CSS gradients and shadows.

## User Interface (UI)

(.assets/screenshot1.png)

## Installation and Usage

1. Clone or download the repository to your local machine.
2. Ensure you have a live server setup for static files or open `index.html` directly in your browser.
3. The app requires internet access to fetch statistics from the LeetCode Stats API.
4. Open the app in your browser, enter a valid LeetCode username, and hit "Search" to view stats.

## File Structure

- `index.html` — Main HTML page containing the structure and UI components.
- `style.css` — Styling for the app including layout, color scheme, animations, and responsive behavior.
- `script.js` — JavaScript handling API calls, DOM manipulation, and event listeners.
- `.assets/` — Folder for images and favicon used in the app.

## API

LeetSync uses the following external APIs to fetch data:

- https://leetcode-stats.tashif.codes - For problem stats by user.
- https://leetcode-stats.tashif.codes/{username}/profile - For user profile data.

## Technologies Used

- HTML5 & CSS3 for layout and styling.
- Modern JavaScript (ES6+) for client-side logic and API integration.
- Flexbox & Grid for responsive design.
- Fetch API for asynchronous network requests.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/LeetSync/issues).

## License

This project is licensed under the MIT License.

---

Made with ❤️ by @rishabh_6116

