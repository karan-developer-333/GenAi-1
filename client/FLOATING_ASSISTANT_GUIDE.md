# Floating AI Assistant - Setup Guide

A beautiful floating orb that provides instant AI assistance across your entire application.

## Files Created

### 1. `/hooks/useFloatingAssistant.ts`
Custom React hook managing the floating assistant's state:
- `isOpen` - Controls chat window visibility
- `messages` - Stores conversation history
- `isLoading` - Tracks AI response state
- `handleSendMessage()` - Sends messages to AI
- `toggleOpen()` / `openChat()` / `closeChat()` - Window controls
- `clearMessages()` - Clears conversation history

### 2. `/components/FloatingAssistant.tsx`
Main component featuring:
- **Floating Orb Button** - Bottom-right corner, always visible
- **Chat Window** - Expandable panel with full chat UI
- **Animated Effects** - Pulse rings, glow effects, smooth transitions
- **Markdown Rendering** - Code blocks with syntax highlighting
- **Source Attribution** - Shows knowledge/web sources
- **Keyboard Support** - ESC to close window

## Integration

The component is automatically added to all pages inside `(app)` route group via `app/(app)/layout.tsx`.

### Adding to Custom Layouts

If you have other layouts where you want the floating assistant:

```tsx
import { FloatingAssistant } from '@/components/FloatingAssistant';

export default function YourLayout({ children }) {
  return (
    <div>
      {children}
      <FloatingAssistant />
    </div>
  );
}
```

### Standalone Usage (without app-wide integration)

```tsx
'use client';

import { FloatingAssistant } from '@/components/FloatingAssistant';

export default function Page() {
  return (
    <div>
      {/* Your page content */}
      <FloatingAssistant />
    </div>
  );
}
```

## Customization

### Changing Orb Position
Edit the fixed positioning in `FloatingAssistant.tsx`:

```tsx
// Current: bottom-right
<motion.button className="fixed bottom-6 right-6 z-50">

// Change to bottom-left
className="fixed bottom-6 left-6 z-50">

// Change to top-right
className="fixed top-20 right-6 z-50">
```

### Customizing Chat Window Size
```tsx
// Current: 384px wide, 500px tall
className="w-96 h-[500px]"

// Make it larger
className="w-[500px] h-[600px]"

// Make it smaller/mobile-friendly
className="w-[340px] h-[400px]"
```

### Changing Orb Color
```tsx
// Current: Blue gradient
className="bg-gradient-to-br from-[#153081] to-[#2655C7]"

// Change to purple
className="bg-gradient-to-br from-purple-600 to-purple-800"

// Change to green
className="bg-gradient-to-br from-emerald-600 to-emerald-800"
```

### Custom Initial Greeting
Edit the empty state in the messages area:

```tsx
{messages.length === 0 && (
  <div className="flex flex-col items-center...">
    <h4 className="text-body font-semibold text-white mb-2">
      Your Custom Greeting Here
    </h4>
    <p className="text-tiny text-[#4B6C8F]">
      Custom instructions or tips
    </p>
  </div>
)}
```

### Adding Quick Action Buttons
Add suggested prompts in the empty state:

```tsx
<div className="flex flex-col items-center...">
  {/* Existing content */}
  
  <div className="flex flex-wrap gap-2 mt-4 justify-center">
    <button 
      onClick={() => handleSendMessage("Search my saves for...")}
      className="px-3 py-1.5 rounded-lg bg-[#539AE9]/10 text-[#539AE9] text-xs hover:bg-[#539AE9]/20 transition-colors"
    >
      Search saves
    </button>
    <button 
      onClick={() => handleSendMessage("What are my recent items?")}
      className="px-3 py-1.5 rounded-lg bg-[#539AE9]/10 text-[#539AE9] text-xs hover:bg-[#539AE9]/20 transition-colors"
    >
      Recent items
    </button>
  </div>
</div>
```

## API Integration

The floating assistant uses your existing `/api/agent/chat` endpoint. No additional backend setup needed.

### Message Format

The hook expects responses in SSE format:
```typescript
// Chunk response
{data: {"type": "chunk", "data": "text content"}}

// Sources response
{data: {"type": "sources", "data": { knowledge: [], web: [] }}}

// Error response
{data: {"type": "error", "error": "error message"}}
```

### Connecting to Different API
To use a different AI endpoint, update `handleSendMessage` in `useFloatingAssistant.ts`:

```typescript
const res = await fetch('/your-api-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    query: input,
    // Add any additional parameters
  }),
});
```

## Features

### Keyboard Shortcuts
- `Escape` - Close chat window
- `Enter` - Send message (when focused on input)

### Touch/Mobile Support
- Tap orb to open/close
- Responsive chat window sizing
- Touch-friendly button sizes

### Animations
- Spring physics for window open/close
- Pulse animation on orb
- Smooth scroll for messages
- Bounce loading indicator

## Troubleshooting

### Chat not opening?
- Check browser console for errors
- Verify `FloatingAssistant` is imported correctly
- Ensure theme/CSS variables are defined

### Messages not sending?
- Verify `/api/agent/chat` endpoint is working
- Check network tab for request/response
- Ensure user is authenticated (if required)

### Styling issues?
- Verify Tailwind classes are working
- Check if theme variables are defined in `globals.css`
- Ensure parent containers don't have conflicting styles

## TypeScript Support

All components are fully typed. Key types:

```typescript
// Message type
interface FloatingMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    knowledge: { title: string; url: string }[];
    web: { title: string; url: string }[];
  };
}

// Hook return type
interface UseFloatingAssistantReturn {
  isOpen: boolean;
  messages: FloatingMessage[];
  isLoading: boolean;
  scrollRef: RefObject<HTMLDivElement>;
  handleSendMessage: (input: string) => Promise<void>;
  clearMessages: () => void;
  toggleOpen: () => void;
  openChat: () => void;
  closeChat: () => void;
}
```

## Performance Notes

- Component uses client-side state only
- Messages persist only during session (cleared on refresh)
- Streaming responses reduce perceived latency
- Lazy animation (framer-motion) for smooth 60fps

## Future Enhancements

Potential improvements to consider:
- Persist chat history to localStorage
- Add voice input support
- Implement conversation threads
- Add file/image upload capability
- Customizable themes/colors
- Notification sounds
