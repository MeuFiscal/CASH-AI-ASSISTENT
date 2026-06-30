# providers/

Composed Context Providers that wrap the application tree.

Provider composition pattern — keeps `App.tsx` clean.

## Usage

```tsx
// providers/AppProviders.tsx
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          {children}
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```
