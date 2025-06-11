# Tweets Section

The tweets section displays a smooth horizontal scrolling carousel of tweets that moves from right to left and pauses when hovered.

## Customization

### Adding Real Tweets

1. Find tweets from your satisfied customers or users
2. Copy the tweet URL (e.g., `https://twitter.com/username/status/1628832338187636740`)
3. Extract the tweet ID (the numbers at the end: `1628832338187636740`)
4. Replace the placeholder IDs in `tweets-section.tsx`:

```typescript
const tweetIds = [
  "1628832338187636740", // Your first customer tweet
  "1629307668568633344", // Your second customer tweet
  "YOUR_TWEET_ID_HERE",  // Add more tweet IDs
  // ... add up to 6-8 tweets for best performance
]
```

### Fallback Testimonials

If you want to show custom testimonials instead of tweets, you can:

1. Add `?fallback=true` to your URL to see the fallback testimonials
2. Customize the `fallbackTestimonials` array in the component
3. Or modify the component to always use fallback testimonials

### Animation Speed

To adjust the scrolling speed, modify the CSS animation duration in `globals.css`:

```css
.animate-scroll-left {
  animation: scrollLeft 60s linear infinite; /* Change 60s to your preferred speed */
}
```

### Styling

The tweets are styled with:
- White background with rounded corners
- Shadow effects that increase on hover
- Responsive width (320px per tweet)
- Smooth transitions

## Features

- ✅ Smooth right-to-left scrolling
- ✅ Pauses on hover
- ✅ Infinite loop scrolling
- ✅ Responsive design
- ✅ Fallback testimonials
- ✅ Error handling
- ✅ SSR compatible

## Requirements

- `react-tweet` package installed
- Next.js configuration updated with Twitter domains
- CSS animation keyframes in globals.css 