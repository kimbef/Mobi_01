# SEO Keyword Research App

A React Native mobile app with web support for SEO keyword research. Features keyword analysis, Google search integration, trend analysis, and AI-powered keyword generation.

## Features

- 🔍 **Keyword Analysis**: Search volume, competition, CPC, and difficulty metrics
- 📊 **Trend Visualization**: 30-day trend charts for keyword popularity
- 🤖 **AI Keyword Generation**: Smart keyword suggestions and variations
- 💾 **Local Storage**: Persistent search history across sessions
- 📁 **CSV Export**: Export search history and results for reporting
- 🔄 **API Switching**: Easy switching between different keyword research APIs
- ⚡ **Caching**: Built-in caching to reduce API calls
- 🚦 **Rate Limiting**: Automatic rate limiting to respect API limits
- 📱 **Cross-Platform**: Runs on Android, iOS, and Web
- 🎨 **Modern UI**: Clean, intuitive interface with loading states

## Tech Stack

- **React Native** (0.81.5) with **Expo** (54.0.30)
- **TypeScript** for type safety
- **Zustand** for state management
- **Axios** for API requests
- **AsyncStorage** for local data persistence
- **React Native Paper** for UI components

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ApiSelector.tsx
│   ├── KeywordResults.tsx
│   └── KeywordSearchInput.tsx
├── config/             # Configuration files
│   └── api.ts          # API configurations
├── screens/            # Main app screens
│   └── KeywordSearchScreen.tsx
├── services/           # API services
│   ├── BaseApiService.ts
│   ├── MockApiService.ts
│   └── ApiServiceFactory.ts
├── store/              # State management
│   └── appStore.ts
├── types/              # TypeScript types
│   └── index.ts
└── utils/              # Utility functions
    ├── rateLimiter.ts
    └── storage.ts
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- For Android development: Android Studio with Android SDK
- For iOS development: Xcode (macOS only)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kimbef/Mobi_01.git
cd Mobi_01
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure API keys in a `.env` file:
```env
GOOGLE_ADS_API_KEY=your_key_here
SEMRUSH_API_KEY=your_key_here
AHREFS_API_KEY=your_key_here
```

### Running the App

#### Web
```bash
npm run web
```
Open http://localhost:8081 in your browser.

#### Android
```bash
npm run android
```
Make sure you have an Android emulator running or a device connected.

#### iOS (macOS only)
```bash
npm run ios
```
Make sure you have Xcode installed and an iOS simulator configured.

### Development
```bash
npm start
```
This will start the Expo development server. Press:
- `w` to open in web browser
- `a` to open on Android
- `i` to open on iOS

## API Configuration

The app supports multiple keyword research APIs with easy switching. Configure APIs in `src/config/api.ts`:

### Supported APIs

1. **Mock API** (Default)
   - No configuration needed
   - Generates realistic test data
   - Perfect for development and testing

2. **Google Trends**
   - Real-time trend data from Google
   - Requires configuration

3. **Google Keyword Planner**
   - Official Google Ads API
   - Requires Google Ads API key

4. **SEMrush**
   - Comprehensive SEO data
   - Requires SEMrush API key

5. **Ahrefs**
   - Backlink and keyword data
   - Requires Ahrefs API key

### Switching APIs

To switch APIs:
1. Update the API configuration in `src/config/api.ts`
2. Add your API key to the `.env` file
3. Set `enabled: true` for the API you want to use
4. Use the API selector in the app to switch between enabled APIs

### Adding a New API

1. Create a new service class extending `BaseApiService`:
```typescript
export class MyApiService extends BaseApiService {
  constructor() {
    super('https://api.example.com', process.env.MY_API_KEY, 'myapi');
  }

  async searchKeyword(keyword: string): Promise<KeywordAnalysis> {
    // Implementation
  }
  
  // Implement other required methods...
}
```

2. Register it in `ApiServiceFactory.ts`:
```typescript
case 'myapi':
  service = new MyApiService();
  break;
```

3. Add configuration to `src/config/api.ts`:
```typescript
myapi: {
  name: 'My API',
  type: 'myapi',
  apiKey: process.env.MY_API_KEY,
  baseUrl: 'https://api.example.com',
  enabled: true,
}
```

## Features in Detail

### Keyword Analysis
Enter any keyword to get:
- Search volume estimates
- Competition level (Low/Medium/High)
- Cost per click (CPC) data
- Keyword difficulty score
- Related keyword suggestions

### Trend Analysis
View 30-day trend charts showing:
- Historical search volume
- Trend direction (up/down)
- Visual bar chart representation

### Search History
- Automatically saves all searches
- Persistent across app restarts
- Quick access to previous analyses
- Clear history option

### CSV Export
Export your search history including:
- Keywords searched
- Search volumes
- Competition levels
- CPC data
- Timestamps

### Caching & Rate Limiting
- Automatic caching reduces redundant API calls
- 1-hour cache duration (configurable)
- Rate limiting prevents API throttling
- Maximum 60 requests per minute (configurable)

## Building for Production

### Android APK
```bash
eas build --platform android
```

### iOS App
```bash
eas build --platform ios
```

### Web Build
```bash
npm run web:build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or contributions, please open an issue on GitHub.
