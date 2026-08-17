# Light & Dark Mode for RakshaNet

Add a proper theme system with a visible toggle, defaulting to the user's system preference and remembering their choice.

## What the user gets
- A sun/moon toggle button in the header (desktop and mobile), next to "Activate".
- Three states cycled/selected: Light, Dark, System.
- Choice persists across reloads; no white flash on load in dark mode.
- Sonner toasts follow the active theme.

## Design work
The dark palette already exists in `src/styles.css` but is incomplete — it is missing dark values for `--destructive`, `--emergency`, `--trust`, `--verified`, `--warn`, `--ring`, chart colors, sidebar tokens, and the hero/emergency gradients and shadows. These get dark variants tuned for contrast on the dark navy background so emergency red, trust blue and verified green stay legible.

Pages are then reviewed in dark mode for any hardcoded light-only styling (hero overlays, badges, printable RakshaPass, admin cards) and switched to semantic tokens.

## Technical details
- Add a lightweight `ThemeProvider` (`src/lib/theme.tsx`): stores `light | dark | system` in localStorage, applies/removes the `.dark` class on `document.documentElement`, and listens to `prefers-color-scheme` changes when set to system.
- Add a blocking inline script in `src/routes/__root.tsx` shell `<head>` that sets the class before paint to avoid a flash.
- Wrap the app in `ThemeProvider` inside `RootComponent`, above `RakshaNetProvider`.
- New `src/components/raksha/theme-toggle.tsx` using the existing shadcn dropdown-menu + button, with lucide `Sun`/`Moon`/`Monitor` icons; rendered in `SiteNav`.
- Pass the resolved theme to `<Toaster />` so toast colors match.
- No backend or state-model changes; the RakshaNet store is untouched.
